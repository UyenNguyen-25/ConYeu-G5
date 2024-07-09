import asyncHandler from "express-async-handler";
import e, { RequestHandler } from "express";
import OrderItem from "../models/OrderItem";
import Feedback from "../models/Feedback";
import Product from "../models/Product";

const createNewFeedback: RequestHandler = asyncHandler(
    async (req: any, res: any): Promise<any> => {
        try {
            const {
                order_items_id,
                feedback_rating,
                feedback_description,
                user_id
            } = req.body;

            const orderItem = await OrderItem.findById(order_items_id);
            if (!orderItem) {
                return res.status(400).json({ message: "Order item does not exist" });
            }

            const newFeedback = new Feedback({
                order_items_id,
                feedback_rating,
                user_id,
                feedback_description,
            });

            await newFeedback.save();

            const product = await Product.findById(orderItem.product_id); 
            if (product) {
                product.feedback_id.push(newFeedback._id);
                await product.save();
            }
            res.status(201).json({ message: "Feedback created successfully", data: newFeedback });

        } catch (error) {
            console.log(error);
            res.status(500).json("Internal server error.");
        }
    }
);

const feedbackController = {
    createNewFeedback,
};

export default feedbackController;