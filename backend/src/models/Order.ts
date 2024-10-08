import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  fullAddress: {
    type: String,
    required: true
  }
}, { timestamps: true });

const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    }]
    ,
    total_money: {
      type: Number,
      required: true,
    },
    order_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderStatus",
      default: "666c24fef787959e8ad3c51a",
      required: true,
    },
    address: {
      type: AddressSchema,
      required: true
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;