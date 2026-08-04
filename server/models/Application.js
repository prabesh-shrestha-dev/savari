import mongoose from "mongoose";

const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    identityNumber: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      required: true,
    },

    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },

    temporaryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    licenseCategory: {
      type: String,
      enum: ["A", "B", "K", "H"],
      required: true,
    },

    currentStep: {
      type: String,
      enum: [
        "application_pending",
        "application_rejected",
        "application_approved",

        "biometric_pending",
        "biometric_failed",
        "biometric_completed",

        "written_exam_pending",
        "written_exam_failed",
        "written_exam_completed",

        "practical_exam_pending",
        "practical_exam_failed",
        "practical_exam_completed",

        "license_card_ready",
        "license_card_collected",
      ],
      default: "application_pending",
      index: true
    },

    rejection: {
      reason: {
        type: String,
        trim: true,
      },

      rejectedAt: {
        type: Date,
      },
    },

    closed: {
      type: Boolean,
      default: false
    },

    biometric: {
      schedule: {
        type: Schema.Types.ObjectId,
        ref: "Schedule"
      },

      completedAt: {
        type: Date,
      },
    },

    writtenExam: {
      schedule: {
        type: Schema.Types.ObjectId,
        ref: "Schedule"
      },

      slot: {
        type: Schema.Types.ObjectId,
      },

      resultDate: {
        type: Date,
      },
    },

    practicalExam: {
      schedule: {
        type: Schema.Types.ObjectId,
        ref: "Schedule"
      },

      attempts: {
        type: Number,
        default: 0,
        min: 0,
        max: 3,
      },

      resultDate: {
        type: Date,
      },
    },

    licenseCard: {
      readyAt: {
        type: Date,
      },

      collectedAt: {
        type: Date,
      },
    },

    eligibleToReapplyAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({
  user: 1,
  closed: 1,
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;