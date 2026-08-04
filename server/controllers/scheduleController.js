import Schedule from "../models/Schedule.js";
import Application from "../models/Application.js";

const BIOMETRIC_CAPACITY = 150;
const WRITTEN_SLOT_CAPACITY = 25;
const PRACTICAL_CAPACITY = 50;

const createSchedule = async (req, res) => {
  try {
    const { type, date } = req.body;

    if (!type || !date) {
      return res.status(400).json({
        success: false,
        message: "Schedule type and date are required.",
      });
    }

    if (
      ![
        "biometric",
        "written_exam",
        "practical_exam",
      ].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule type.",
      });
    }

    const scheduleDate = new Date(date);

    if (isNaN(scheduleDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    scheduleDate.setHours(0, 0, 0, 0);

    if (scheduleDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot create a schedule for a past date.",
      });
    }

    const existingSchedule = await Schedule.findOne({
      type,
      date: scheduleDate,
    });

    if (existingSchedule) {
      return res.status(409).json({
        success: false,
        message: `A ${type.replace("_", " ")} schedule already exists for this date.`,
      });
    }

    let scheduleData = {
      type,
      date: scheduleDate,
      status: "upcoming",
    };

    if (type === "biometric") {
      scheduleData.biometricCapacity = {
        capacity: BIOMETRIC_CAPACITY,
        booked: 0,
      };
    }

    if (type === "written_exam") {
      scheduleData.slots = [
        {
          startTime: "10:30",
          endTime: "11:00",
          capacity: WRITTEN_SLOT_CAPACITY,
          booked: 0,
        },
        {
          startTime: "12:00",
          endTime: "12:30",
          capacity: WRITTEN_SLOT_CAPACITY,
          booked: 0,
        },
        {
          startTime: "13:30",
          endTime: "14:00",
          capacity: WRITTEN_SLOT_CAPACITY,
          booked: 0,
        },
      ];
    }

    if (type === "practical_exam") {
      scheduleData.practicalCapacity = {
        A: {
          capacity: PRACTICAL_CAPACITY,
          booked: 0,
        },
        B: {
          capacity: PRACTICAL_CAPACITY,
          booked: 0,
        },
        K: {
          capacity: PRACTICAL_CAPACITY,
          booked: 0,
        },
        H: {
          capacity: PRACTICAL_CAPACITY,
          booked: 0,
        },
      };
    }

    const schedule = await Schedule.create(scheduleData);

    return res.status(201).json({
      success: true,
      message: "Schedule created successfully.",
      schedule,
    });

  } catch (err) {
    console.error("Create schedule error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .sort({
        date: 1,
        type: 1,
      });

    return res.status(200).json({
      success: true,
      schedules,
    });

  } catch (err) {
    console.error("Get all schedules error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const getAvailableSchedules = async (req, res) => {
  try {
    const { type } = req.query;
    const userId = req.user.id;

    if (
      ![
        "biometric",
        "written_exam",
        "practical_exam",
      ].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule type.",
      });
    }

    const application = await Application.findOne({
      user: userId,
      closed: false,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No active application found.",
      });
    }

    if (type === "biometric") {
      if (
        ![
          "application_approved",
          "biometric_pending",
          "biometric_failed",
        ].includes(application.currentStep)
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not eligible to book a biometric schedule.",
        });
      }

      if (application.biometric.schedule) {
        return res.status(400).json({
          success: false,
          message: "You already have a biometric schedule booked.",
        });
      }
    }

    if (type === "written_exam") {
      if (
        ![
          "biometric_completed",
          "written_exam_pending",
        ].includes(application.currentStep)
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not eligible to book a written exam.",
        });
      }

      if (application.writtenExam.schedule) {
        return res.status(400).json({
          success: false,
          message: "You already have a written exam scheduled.",
        });
      }
    }

    if (type === "practical_exam") {
      if (
        ![
          "written_exam_completed",
          "practical_exam_pending",
          "practical_exam_failed",
        ].includes(application.currentStep)
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not eligible to book a practical exam.",
        });
      }

      if (application.practicalExam.attempts >= 3) {
        return res.status(400).json({
          success: false,
          message: "You have used all 3 practical exam attempts.",
        });
      }

      if (application.practicalExam.schedule) {
        return res.status(400).json({
          success: false,
          message: "You already have a practical exam scheduled.",
        });
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0 , 0);

    const schedules = await Schedule.find({
      type,
      status: "upcoming",
      date: {
        $gte: today,
      },
    }).sort({
      date: 1,
    });

    const availableSchedules = schedules.map((schedule) => {
      const scheduleObject = schedule.toObject();

      if (type === "biometric") {
        if (
          schedule.biometricCapacity.booked >=
          schedule.biometricCapacity.capacity
        ) {
          return null;
        }
      }

      if (type === "written_exam") {
        scheduleObject.slots = scheduleObject.slots.filter(
          slot => slot.booked < slot.capacity
        );
        
        if (scheduleObject.slots.length === 0) {
          return null;
        }
      }

      if (type === "practical_exam") {
        const category = application.licenseCategory;

        const categoryCapacity = schedule.practicalCapacity?.[category];

        if (
          !categoryCapacity ||
          categoryCapacity.booked >= categoryCapacity.capacity
        ) {
          return null;
        }
      }

      return scheduleObject;
    }).filter(Boolean);

    return res.status(200).json({
      success: true,
      schedules: availableSchedules,
    });

  } catch (err) {
    console.error("Get available schedules error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const getMySchedules = async (req, res) => {
  try {
    const userId = req.user.id;

    const application = await Application.findOne({
      user: userId,
      closed: false,
    })
      .populate("biometric.schedule")
      .populate("writtenExam.schedule")
      .populate("practicalExam.schedule");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No active application found.",
      });
    }

    return res.status(200).json({
      success: true,
      schedules: {
        biometric: application.biometric,
        writtenExam: application.writtenExam,
        practicalExam: application.practicalExam,
      },
    });

  } catch (err) {
    console.error("Get my schedules error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const bookSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { scheduleId } = req.params;
    const { slotId } = req.body;

    const application = await Application.findOne({
      user: userId,
      closed: false,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No active application found.",
      });
    }

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      status: "upcoming",
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or unavailable.",
      });
    }

    if (schedule.type === "biometric") {
      if (
        application.currentStep !==
          "application_approved" &&
        application.currentStep !==
          "biometric_failed"
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not eligible for biometric booking.",
        });
      }

      if (application.biometric.schedule) {
        return res.status(400).json({
          success: false,
          message: "You already have a biometric schedule booked.",
        });
      }

      if (
        schedule.biometricCapacity.booked >=
        schedule.biometricCapacity.capacity
      ) {
        return res.status(400).json({
          success: false,
          message: "Biometric schedule is fully booked.",
        });
      }

      schedule.biometricCapacity.booked += 1;

      application.biometric.schedule = schedule._id;

      application.currentStep = "biometric_pending";

      application.writtenExam.schedule = null;
      application.practicalExam.schedule = null;

      await schedule.save();
      await application.save();

      return res.status(200).json({
        success: true,
        message: "Biometric schedule booked successfully.",
        schedule,
        application,
      });
    }

    if (schedule.type === "written_exam") {
      if (
        ![
          "biometric_completed",
        ].includes(application.currentStep)
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not eligible for written exam booking.",
        });
      }

      if (application.writtenExam.schedule) {
        return res.status(400).json({
          success: false,
          message: "You already have a written exam scheduled.",
        });
      }

      if (!slotId) {
        return res.status(400).json({
          success: false,
          message: "Written exam slot is required.",
        });
      }

      const slot = schedule.slots.id(slotId);

      if (!slot) {
        return res.status(404).json({
          success: false,
          message: "Written exam slot not found.",
        });
      }

      slot.booked += 1;

      application.writtenExam.schedule = schedule._id;
      application.writtenExam.slot = slot._id;

      application.currentStep = "written_exam_pending";

      application.biometric.schedule = null;
      application.practicalExam.schedule = null;

      await schedule.save();
      await application.save();

      return res.status(200).json({
        success: true,
        message: "Written exam scheduled successfully.",
        schedule,
        slot,
        application,
      });
    }

    if (schedule.type === "practical_exam") {
      if (
        ![
          "written_exam_completed",
          "practical_exam_failed",
        ].includes(application.currentStep)
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not eligible for practical exam booking.",
        });
      }

      if (application.practicalExam.attempts >= 3) {
        return res.status(400).json({
          success: false,
          message: "You have used all 3 practical exam attempts.",
        });
      }

      if (application.practicalExam.schedule) {
        return res.status(400).json({
          success: false,
          message: "You already have a practical exam scheduled.",
        });
      }

      const category = application.licenseCategory;

      const categoryCapacity = schedule.practicalCapacity?.[category];

      if (!categoryCapacity) {
        return res.status(400).json({
          success: false,
          message: "Practical exam is not available for your license category.",
        });
      }

      if (categoryCapacity.booked >= categoryCapacity.capacity) {
        return res.status(400).json({
          success: false,
          message: "Practical exam schedule is fully booked for your category.",
        });
      }

      categoryCapacity.booked += 1;

      application.practicalExam.schedule = schedule._id;
      
      application.currentStep = "practical_exam_pending";

      application.biometric.schedule = null;
      application.writtenExam.schedule = null;

      await schedule.save();
      await application.save();

      return res.status(200).json({
        success: true,
        message: "Practical exam scheduled successfully.",
        schedule,
        application,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Unsupported schedule type.",
    });

  } catch (err) {
    console.error("Book schedule error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { date, status } = req.body;

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    if (status) {
      if (
        ![
          "upcoming",
          "ongoing",
          "completed",
          "cancelled",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid schedule status.",
        });
      }

      schedule.status = status;
    }

    if (date) {
      const newDate = new Date(date);

      if (isNaN(newDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date.",
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (newDate < today) {
        return res.status(400).json({
          success: false,
          message: "Cannot set schedule to a past date.",
        });
      }

      const duplicateSchedule = await Schedule.findOne({
        type: schedule.type,
        date: newDate,
        _id: { $ne: scheduleId },
      });

      if (duplicateSchedule) {
        return res.status(409).json({
          success: false,
          message: "Another schedule of this type already exists on this date.",
        });
      }

      schedule.date = newDate;
    }

    await schedule.save();

    return res.status(200).json({
      success: true,
      message: "Schedule updated successfully.",
      schedule,
    });

  } catch (err) {
    console.error("Update schedule error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const cancelSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    if (schedule.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Schedule is already cancelled.",
      });
    }

    if (schedule.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed schedules cannot be cancelled.",
      });
    }

    schedule.status = "cancelled";
    await schedule.save();

    if (schedule.type === "biometric") {
      await Application.updateMany(
        { "biometric.schedule": scheduleId },
        {
          $set: {
            "biometric.schedule": null,
            currentStep: "application_approved",
          },
        }
      );
    }

    if (schedule.type === "written_exam") {
      await Application.updateMany(
        { "writtenExam.schedule": scheduleId },
        {
          $set: {
            "writtenExam.schedule": null,
            "writtenExam.slot": null,
            currentStep: "biometric_completed",
          },
        }
      );
    }

    if (schedule.type === "practical_exam") {
      await Application.updateMany(
        { "practicalExam.schedule": scheduleId },
        {
          $set: {
            "practicalExam.schedule": null,
            currentStep: "written_exam_completed",
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Schedule cancelled successfully.",
      schedule,
    });

  } catch (err) {
    console.error("Cancel schedule error:", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

export { createSchedule, getAllSchedules, getAvailableSchedules, getMySchedules, bookSchedule,updateSchedule, cancelSchedule };