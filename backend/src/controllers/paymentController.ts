// controllers/paymentController.js

import { RequestHandler } from "express";
import asyncHandler from 'express-async-handler';
import Payment from "../models/Payment";

// Controller function to get payment details by orderId
const getPaymentByOrderId: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
  const { orderId } = req.params;

  try {
    const payment = await Payment.findOne({ order_id: orderId }); // Example: Query your Payment model

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment); // Example: Send payment details as JSON response
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const paymentController = { getPaymentByOrderId }

export default paymentController;
