import asyncHandler from "express-async-handler";
import e, { RequestHandler } from "express";
import OrderStatus from "../models/OrderStatus";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Payment from "../models/Payment";
import Product from "../models/Product";
import User from "../models/User";

const autoCreateStatus: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<any> => {
    try {
      // customer: pending (don hang dang cho dc confirm) / processing: COD - (Manager confirm don hang pending -> process)
      // processing: VNPay - bắt api từ VNPay pending -> processing
      // cancelled: trang thai cancel xay ra khi khach huy don
      // delivering: don hang dang duoc van chuyen (manager chuyen trang cua order tu processing -> delivering)
      // completed: trang thai completed xay ra khi ma KH da nhan don va tien da tra du (manager doi trang thai)

      const statuses = [
        "pending",
        "processing",
        "cancelled",
        "delivering",
        "completed",
      ];

      for (const item of statuses) {
        await OrderStatus.create({
          order_status_description: item,
        });
      }

      res.status(200).json("auto create order status successfullly");
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal server error.");
    }
  }
);

const getOrderStatus: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<any> => {
    try {
      const status = await OrderStatus.find();
      if (!status?.length) {
        return res.status(400).json({ message: "No order status found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal server error.");
    }
  }
);

const createOrder: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<void> => {
    const { user_id, order_items, payment_method, shippingAddress, isDefault } =
      req.body;

    if (
      !user_id ||
      !order_items ||
      !Array.isArray(order_items) ||
      !shippingAddress
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // const { name, phone, fullAddress } = shippingAddress;
    const fullname = shippingAddress.fullname;
    const phoneNumber = shippingAddress.phoneNumber;
    let fullAddress;
    if (isDefault) {
      fullAddress = shippingAddress.address_line1;
    } else {
      fullAddress = shippingAddress.address_line2;
    }

    const pendingStatus = await OrderStatus.findOne({
      order_status_description: "pending",
    });
    if (!pendingStatus) {
      throw new Error("Pending status not found");
    }
    const order_status_id = pendingStatus._id;

    const orderItemIds = await Promise.all(
      order_items.map(async (item: any) => {
        const product = await Product.findById(item.product_id).select(
          "product_price quantity"
        );
        if (!product) {
          throw new Error(`Product with id ${item.product_id} not found`);
        }
        if (product.quantity < item.quantity) {
          throw new Error(
            `Not enough quantity for product with id ${item.product_id}`
          );
        }

        const orderItem = new OrderItem({
          quantity: item.quantity,
          product_id: item.product_id,
          price: product.product_price,
        });
        await orderItem.save();
        console.log("first", product);
        product.quantity -= item.quantity;
        console.log("quantity after buy:", product.quantity);
        await product.save();

        return orderItem._id;
      })
    );

    const totalPrices = await Promise.all(
      orderItemIds.map(async (orderItemId: any) => {
        const orderItem = await OrderItem.findById(orderItemId);
        if (orderItem && orderItem.price) {
          const totalPrice = orderItem.price * orderItem.quantity;
          return totalPrice;
        } else {
          console.log("error");
          throw new Error(`OrderItem with id ${orderItemId} not found`);
        }
      })
    );

    // Sum up total prices
    const totalAmount = totalPrices.reduce((acc, curr) => acc + curr, 0);

    let order = new Order({
      user_id,
      order_items: orderItemIds,
      total_money: totalAmount,
      order_status_id,
      address: { fullname, phoneNumber, fullAddress },
    });

    await order.save();

    let newPayment = new Payment({
      order_id: order._id,
      payment_method,
      payment_status: "Unpaid",
    });
    await newPayment.save();

    if (!order) return res.status(400).send("the order cannot be created!");
    return res.status(201).json(order);
  }
);

const findStatus = async (statusDescription: string): Promise<string> => {
  try {
    let orderStatus = await OrderStatus.findOne({
      order_status_description: statusDescription,
    });
    if (!orderStatus) {
      orderStatus = await OrderStatus.create({
        order_status_description: statusDescription,
      });
    }
    return orderStatus._id.toString();
  } catch (error) {
    console.log(error);
    throw new Error("Error finding or creating order status");
  }
};

const updateOrderStatus: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<any> => {
    try {
      const { orderId } = req.params;
      const { newStatus } = req.body;

      const currentOrder = await Order.findById(orderId);
      if (!currentOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      const newStatusId = await findStatus(newStatus);

      if (newStatus === "cancelled") {
        const order = await Order.findById(orderId);
        order?.order_items.map(async (item) => {
          //   console.log(item);
          const orderItem = await OrderItem.findById(item?._id);
          const product = await Product.findById(orderItem?.product_id);
          //   console.log("product_id", product?._id);

          const increaseQuantity = orderItem!.quantity + product!.quantity;
          await Product.findByIdAndUpdate(orderItem?.product_id, {
            quantity: increaseQuantity,
          });
        });
      }

      await Order.findByIdAndUpdate(orderId, { order_status_id: newStatusId });

      res.status(200).json({ message: "Update order status successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

const getOrderDetail: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<any> => {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        return res.status(400).json({ message: "Order ID required" });
      }
      const order = await Order.findById(orderId)
        .populate("order_items")
        .populate("order_status_id")
        .exec();
      res.status(200).json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

const getOrderByStatusAndUserId: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<any> => {
    const { userId, status } = req.body;

    try {
      const orderStatus = await OrderStatus.findOne({
        order_status_description: status,
      });

      if (!orderStatus) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy trạng thái đơn hàng." });
      }

      const orders = await Order.find({
        user_id: userId,
        order_status_id: orderStatus._id,
      })
        .populate("order_items")
        .populate("order_status_id")
        .exec();

      if (!orders.length) {
        return res.status(200).json([]);
      }

      res.status(200).json(orders);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi khi lấy đơn hàng." });
    }
  }
);

const getOrderByUserPhone: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<any> => {
    try {
      const user_phoneNumber = req.query.phoneNumber;
      const status = req.query.status;
      const from = req.query.from;
      const to = req.query.to;

      // Tìm trạng thái đơn hàn
      const user = await User.findOne({ user_phoneNumber });

      const orderStatus = await OrderStatus.findOne({
        order_status_description: status,
      });

      const query: any = {};

      if (from?.length > 0 || to?.length > 0) {
        query.createdAt = { $gte: new Date(from), $lte: new Date(to) };
      }

      if (status?.length > 0 && orderStatus) {
        query.order_status_id = orderStatus._id;
        if (user_phoneNumber?.length > 0 && user) {
          query.user_id = user?._id;
        }
      } else if (user_phoneNumber?.length > 0 || user) {
        query.user_id = user?._id;
      }

      const orders = await Order.find(query)
        .populate("user_id", "user_phoneNumber")
        .populate("order_items")
        .populate("order_status_id")
        .exec();

      const payments = await Payment.find();

      const combineData = orders.map((order) => {
        // console.log(order._id);
        const filterPayments = payments.find(
          (payment) => order._id.toString() === payment.order_id.toString()
        );
        // console.log(filterPayments);
        return { order, payment: filterPayments };
      });

      res.status(200).json(combineData);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

const getOrderByMonth: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<any> => {
    try {
      const order = await Order.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            totalOrders: { $sum: 1 },
          },
        },
      ]);
      return res.status(200).json(order);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

const orderController = {
  autoCreateStatus,
  createOrder,
  getOrderStatus,
  updateOrderStatus,
  getOrderDetail,
  getOrderByStatusAndUserId,
  getOrderByUserPhone,
  getOrderByMonth,
};

export default orderController;
