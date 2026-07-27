import mongoose from "mongoose";

const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "application_fee",
        "practical_exam_fee",
        "license_card_fee",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    practicalAttempt: {
      type: Number,
      min: 1,
      max: 3,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    paidAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;