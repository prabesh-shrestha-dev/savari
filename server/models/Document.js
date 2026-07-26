import mongoose from "mongoose";

const { Schema } = mongoose;

const documentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    identityCard: {
      url: String,
      publicId: String,
      status: {
        type: String,
        enum: ["not_uploaded","pending", "approved", "rejected"],
        default: "not_uploaded",
      },
    },
    passportSizePhoto: {
      url: String,
      publicId: String,
      status: {
        type: String,
        enum: ["not_uploaded","pending", "approved", "rejected"],
        default: "not_uploaded",
      },
    },
    bloodGroupReport: {
      url: String,
      publicId: String,
      status: {
        type: String,
        enum: ["not_uploaded","pending", "approved", "rejected"],
        default: "not_uploaded",
      },
    },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;