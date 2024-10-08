import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    order_items_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback_rating: {
      type: Number,
      required: true,
    },
    feedback_description: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
