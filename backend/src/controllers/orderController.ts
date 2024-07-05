import asyncHandler from 'express-async-handler';
import e, { RequestHandler } from "express";
import OrderStatus from '../models/OrderStatus';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Product from '../models/Product';

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
    // const { user_id, order_items, shippingAddress } = req.body;

    // if (!user_id || !order_items || !Array.isArray(order_items)) {
    //     return res.status(400).json({ message: 'Invalid input data' });
    // }


    // const orderItemIds = await Promise.all(order_items.map(async (item: any) => {
    //     let orderItem = new OrderItem({
    //         quantity: item.quantity,
    //         product_id: item.product_id
    //     })
    //     orderItem = await orderItem.save();
    //     return orderItem._id;
    // }));
    // const orderItemResolve = await orderItemIds;
    // console.log(orderItemResolve)

    // const totalPrices = await Promise.all(orderItemIds.map(async (orderItemId: any) => {
    //     const orderItem = await OrderItem.findById(orderItemId).populate('product_id', 'product_price');
    //     if (orderItem && orderItem.product_id && typeof orderItem.product_id === 'object' && 'product_price' in orderItem.product_id) {
    //         const product = orderItem.product_id as any; // Cast to 'any' to access the populated fields
    //         const totalPrice = product.product_price * orderItem.quantity;
    //         return totalPrice;
    //     } else {
    //         throw new Error(`OrderItem with id ${orderItemId} not found or Product not populated`);
    //     }
    // }));

    // // Sum up total prices
    // const totalAmount = totalPrices.reduce((acc, curr) => acc + curr, 0)


    // let order = new Order({
    //     user_id,
    //     order_items: orderItemIds,
    //     total_money: totalAmount,
    // })

    // order = await order.save();

    // // await order.updateOne({}, {}).set("order_items", orderItems);
    // // order.save();
    // if (!order)
    //     return res.status(400).send('the order cannot be created!')
    // res.send(order);
    const { user_id, order_items, shippingAddress } = req.body;

    if (!user_id || !order_items || !Array.isArray(order_items) || !shippingAddress) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    const { name, phone, fullAddress } = shippingAddress;

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
        const orderItem = await OrderItem.findById(orderItemId).populate('product_id', 'product_price');
        if (orderItem && orderItem.product_id && typeof orderItem.product_id === 'object' && 'product_price' in orderItem.product_id) {
            const product = orderItem.product_id as any; // Cast to 'any' to access the populated fields
            const totalPrice = product.product_price * orderItem.quantity;
            return totalPrice;
        } else {
            throw new Error(`OrderItem with id ${orderItemId} not found or Product not populated`);
        }
    }));

    // Sum up total prices
    const totalAmount = totalPrices.reduce((acc, curr) => acc + curr, 0);

    let order = new Order({
        user_id,
        order_items: orderItemIds,
        total_money: totalAmount,
        address: { name, phone, fullAddress }
    });

    order = await order.save();

    if (!order) {
        return res.status(400).send('The order cannot be created!');
    }
    res.send(order);
});


const orderController = { autoCreateStatus, createOrder, getOrderStatus }

export default orderController;