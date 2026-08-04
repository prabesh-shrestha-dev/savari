import Application from "../models/Application.js";
import Payment from "../models/Payment.js";
import Document from "../models/Document.js";
import { application, response } from "express";

const createApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      dateOfBirth,
      identityNumber,
      bloodGroup,
      permanentAddress,
      temporaryAddress,
      licenseCategory,
      payment,
    } = req.body;

    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "Payment information is required.",
      });
    }

    if (payment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment was not completed.",
      });
    }

    const APPLICATION_FEE = 500;

    const existingApplication = await Application.findOne({
      user: userId,
      closed: false
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You already have an active application.",
      });
    }

    const documents = await Document.findOne({
      user: userId,
    });

    if (!documents) {
      return res.status(400).json({
        success: false,
        message: "Please upload all required documents first."
      })
    }

    const documentsApproved = 
      documents.identityCard?.status === "approved" &&
      documents.passportSizePhoto?.status === "approved" &&
      documents.bloodGroupReport?.status === "approved";

    if (!documentsApproved) {
      return res.status(400).json({
        success: false,
        message: "All required documents must be approved before applying."
      })
    }

    const application = await Application.create({
      user: userId,
      fullName,
      dateOfBirth,
      identityNumber,
      bloodGroup,
      permanentAddress,
      temporaryAddress,
      licenseCategory,

      currentStep: "application_pending",

      closed: false,
    });

    const newPayment = await Payment.create({
      user: userId,
      application: application._id,

      type: "application_fee",
      amount: APPLICATION_FEE,
      status: "completed",
      transactionId: payment.transactionId,
      paidAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
      payment: newPayment
    });

  } catch (err) {
    console.error("Create application error: ", err);

    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`
    });
  }
};

const getMyApplication = async (req, res) => {
  try {
    const userId = req.user.id;

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

    return res.status(200).json({
      success: true,
      application,
    });

  } catch (err) {
    console.error("Get my application error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const getPendingApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      currentStep: "application_pending",
      closed: false,
    })
      .populate("user", "fullname identifier")
      .sort({ createdAt: -1 })
      .lean();

    const applicationsWithDocuments = await Promise.all(
      applications.map(async (application) => {
        const documents = await Document.findOne({
          user: application.user._id,
        }).lean();

        return {
          ...application,
          documents,
        };
      })
    );

    return res.status(200).json({
      success: true,
      applications: applicationsWithDocuments,
    });

  } catch (err) {
    console.error("Get pending applications error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const reviewApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { decision, reason } = req.body;

    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review decision.",
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      currentStep: "application_pending",
      closed: false,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found or already reviwed.",
      });
    }

    if (decision === "approved") {
      application.currentStep = "application_approved";
    }

    if (decision === "rejected") {
      application.currentStep = "application_rejected";
      application.closed = true;

      application.rejection = {
        reason: reason.trim(),
        rejectedAt: new Date(),
      };
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Application ${decision} successfully.`,
      application,
    });

  } catch (err) {
    console.error("Review application error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const getApplicationsByStage = async (req, res) => {
  try {
    const { currentStep } = req.params;

    const applications = await Application.find({
      currentStep,
      closed: false,
    })
      .populate("user", "fullname identifier")
      .populate("biometric.schedule")
      .populate("writtenExam.schedule")
      .populate("practicalExam.schedule")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      applications
    });

  } catch (err) {
    console.error("Get applications by stage error:", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

export { createApplication, getMyApplication, getPendingApplications, reviewApplication, getApplicationsByStage };