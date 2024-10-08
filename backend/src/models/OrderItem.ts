import mongoose from "mongoose";

const OrderItemsSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
  }
  },
  { timestamps: true }
);

const OrderItem = mongoose.model("OrderItem", OrderItemsSchema);

export default OrderItem;