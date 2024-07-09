import asyncHandler from 'express-async-handler';
import e, { RequestHandler } from "express";
import OrderStatus from '../models/OrderStatus';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import { error } from 'console';
import mongoose from 'mongoose';
import Payment from '../models/Payment';
import Product from '../models/Product';
import User from '../models/User';

const autoCreateStatus: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {

    try {

        // customer: pending (don hang dang cho dc confirm) / processing: COD - (Manager confirm don hang pending -> process)
        // processing: VNPay - bắt api từ VNPay pending -> processing 
        // cancelled: trang thai cancel xay ra khi khach huy don 
        // delivering: don hang dang duoc van chuyen (manager chuyen trang cua order tu processing -> delivering) 
        // completed: trang thai completed xay ra khi ma KH da nhan don va tien da tra du (manager doi trang thai) 

        const statuses = ["pending", "processing", "cancelled", "delivering", "completed"];

        for (const item of statuses) {
            await OrderStatus.create({
                order_status_description: item,
            });
        }

        res.status(200).json('auto create order status successfullly')
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error.')
    }
});

const getOrderStatus: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const status = await OrderStatus.find();
        if (!status?.length) {
            return res.status(400).json({ message: "No order status found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error.');
    }
});


const createOrder: RequestHandler = asyncHandler(async (req: any, res: any): Promise<void> => {
    const { user_id,
        order_items,
        payment_method,
        shippingAddress } = req.body;


    if (!user_id || !order_items || !Array.isArray(order_items) || !shippingAddress) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    // const { name, phone, fullAddress } = shippingAddress;
    const fullname = shippingAddress.fullname;
    const phoneNumber = shippingAddress.phoneNumber;
    const fullAddress = shippingAddress.address_line1;

    const pendingStatus = await OrderStatus.findOne({ order_status_description: 'pending' });
    if (!pendingStatus) {
        throw new Error('Pending status not found');
    }
    const order_status_id = pendingStatus._id;


    const orderItemIds = await Promise.all(order_items.map(async (item: any) => {
        const product = await Product.findById(item.product_id).select('product_price');
        if (!product) {
            throw new Error(`Product with id ${item.product_id} not found`);
        }

        const orderItem = new OrderItem({
            quantity: item.quantity,
            product_id: item.product_id,
            price: product.product_price
        });
        await orderItem.save();
        return orderItem._id;
    }));

    const totalPrices = await Promise.all(orderItemIds.map(async (orderItemId: any) => {
        const orderItem = await OrderItem.findById(orderItemId);
        if (orderItem && orderItem.price) {
            const totalPrice = orderItem.price * orderItem.quantity;
            return totalPrice;
        } else {
            console.log("error");
            throw new Error(`OrderItem with id ${orderItemId} not found`);
        }
    }));

    // Sum up total prices
    const totalAmount = totalPrices.reduce((acc, curr) => acc + curr, 0)


    let order = new Order({
        user_id,
        order_items: orderItemIds,
        total_money: totalAmount,
        order_status_id,
        address: { fullname, phoneNumber, fullAddress }
    })

    await order.save();

    let newPayment = new Payment({
        order_id: order._id,
        payment_method,
        payment_status: "Unpaid"
    });
    await newPayment.save();

    if (!order)
        return res.status(400).send('the order cannot be created!')
    return res.status(201).json(order);
});


const updateOrderStatus: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const { statusUpdate } = req.body;
        const { orderId } = req.params;
        //find order status by order_status_description
        const orderstatus = await OrderStatus.findOne({
            order_status_description: statusUpdate
        });
        if (!orderstatus) {
            return res.status(400).json({ message: "No order status found" });
        } else {
            //get order status id
            const idordertatus = orderstatus._id;
            await Order.findByIdAndUpdate(
                orderId,
                { order_status_id: idordertatus }
            );
            const updateOrderStatus = await Order.findOne({ _id: orderId }).populate('order_status_id')
            res.status(200).json({ message: "Update order status susscessfull" });
            console.log(updateOrderStatus);
            console.log(orderstatus);
            console.log(idordertatus);
        }
    } catch (error) {
        console.log(error);
    }

});

const getOrderDetail: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID required" });
        }
        const order = await Order.findById(orderId)
            .populate('order_items')
            .populate('order_status_id')
            .exec();
        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

});

const getOrderByStatusAndUserId: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    const { userId, status } = req.body;

    try {
        // Tìm trạng thái đơn hàng theo mô tả
        const orderStatus = await OrderStatus.findOne({ order_status_description: status });

        if (!orderStatus) {
            return res.status(404).json({ message: 'Không tìm thấy trạng thái đơn hàng.' });
        }

        // Tìm tất cả đơn hàng của người dùng cụ thể với trạng thái đó
        const orders = await Order.find({ user_id: userId, order_status_id: orderStatus._id })
            .populate('order_items')
            .populate('order_status_id')
            .exec();

            if (!orders.length) {
                return res.status(200).json([]);
            }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy đơn hàng.' });
    }

});

const getOrderByStatusAndUserPhone: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const user_phoneNumber = req.query.phoneNumber ;
        const status = req.query.status 
        const from = req.query.from
        const to = req.query.to
        
        // Tìm trạng thái đơn hàng theo mô tả
        const orderStatus = status && await OrderStatus.findOne({ order_status_description: status });
        
        const user = user_phoneNumber && await User.findOne({user_phoneNumber})
        
        console.log("from ", from, " to ", to);
        
        const query:any = {}

        if (from?.length>0 || to?.length>0) {
            query.createdAt= { $gte: new Date(from), $lte: new Date(to) }
        }

        if (user) {
            query.user_id = user._id
        }

        if (orderStatus) {
            query.order_status_id = orderStatus?._id
        }
        
        const orders = await Order.find(query)
            .populate("user_id","user_phoneNumber")
            .populate('order_items')
            .populate('order_status_id')
            .exec();
        
        res.status(200).json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});


const orderController = { autoCreateStatus, createOrder, getOrderStatus, updateOrderStatus, getOrderDetail, getOrderByStatusAndUserId,getOrderByStatusAndUserPhone }

export default orderController;