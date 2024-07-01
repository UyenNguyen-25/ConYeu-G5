import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.Number,
      ref: "Order",
      required: true,
    },
    payment_date: {
      type: Date,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
