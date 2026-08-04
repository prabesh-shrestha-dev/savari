import mongoose from "mongoose";

const { Schema } = mongoose;

const slotSchema = new Schema(
  {
    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    booked: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const scheduleSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["biometric", "written_exam", "practical_exam"],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    slots: {
      type: [slotSchema],
      default: [],
    },

    biometricCapacity: {
      capacity: {
        type: Number,
        default: 150,
      },

      booked: {
        type: Number,
        default: 0,
      },
    },

    practicalCapacity: {
      A: {
        capacity: {
          type: Number,
          default: 50,
        },

        booked: {
          type: Number,
          default: 0,
        },
      },

      B: {
        capacity: {
          type: Number,
          default: 50,
        },

        booked: {
          type: Number,
          default: 0,
        },
      },

      K: {
        capacity: {
          type: Number,
          default: 50,
        },

        booked: {
          type: Number,
          default: 0,
        },
      },

      H: {
        capacity: {
          type: Number,
          default: 50,
        },

        booked: {
          type: Number,
          default: 0,
        },
      },
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

scheduleSchema.index({
  type: 1,
  date: 1,
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;