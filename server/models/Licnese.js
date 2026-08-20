import mongoose from "mongoose";

const { Schema } = mongoose;

const licenseSchema = new Schema(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    licenseNumber: {
      type: String,
      unique: true,
      required: true,
    },

    fullName: String,

    dateOfBirth: Date,

    bloodGroup: String,

    identityNumber: String,

    licenseCategory: {
      type: [String],
      required: true,
      default: []
    },

    permanentAddress: String,

    issueDate: Date,

    expiryDate: Date,

    status: {
      type: String,
      enum: ["active", "exipred", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const License = mongoose.model("License", licenseSchema);

export default License;