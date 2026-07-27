import Application from "../models/Application.js";
import Payment from "../models/Payment.js";
import Document from "../models/Document.js";

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

export { createApplication };