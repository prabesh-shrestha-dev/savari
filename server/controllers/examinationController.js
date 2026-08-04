import Application from "../models/Application.js";
import License from "../models/Licnese.js";

const markBiometricResult = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { passed } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.currentStep !== "biometric_pending") {
      return res.status(400).json({
        success: false,
        message: "Candidate is not awaiting biometric verification.",
      });
    }

    if (passed) {
      application.currentStep = "biometric_completed";
      application.biometric.completedAt = new Date();
    } else {
      application.currentStep = "biometric_failed";
      application.biometric.schedule = null;
    }

    application.biometric.schedule = null;

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Biometric ${passed ? "passed" : "failed"}`,
      application,
    });

  } catch (err) {
    console.error("Biometric marking error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const markWrittenExamResult = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { passed } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.currentStep !== "written_exam_pending") {
      return res.status(400).json({
        success: false,
        message: "Candidate is not awaiting for written examination.",
      });
    }

    application.writtenExam.resultDate = new Date();

    if (passed) {
      application.currentStep = "written_exam_completed";
    } else {
      application.currentStep = "written_exam_failed";
      application.closed = true;

      application.eligibleToReapplyAt = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000
      );
    }

    application.writtenExam.schedule = null;

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Written exam ${passed ? "passed" : "failed"}.`,
      application,
    });

  } catch (err) {
    console.error("Written exam marking error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const markPracticalExamResult = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { passed } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.currentStep !== "practical_exam_pending") {
      return res.status(400).json({
        success: false,
        message: "Candidate is not awaiting for practical examination.",
      });
    }

    application.practicalExam.resultDate = new Date();

    if (passed) {
      application.currentStep = "practical_exam_completed";
    } else {
      application.practicalExam.attempts += 1;

      if (application.practicalExam.attempts >= 3) {
        application.currentStep = "practical_exam_failed";
        application.closed = true;
        application.practicalExam.schedule = null;
      } else {
        application.currentStep = "practical_exam_failed";
        application.practicalExam.schedule = null;
      }
    }

    application.practicalExam.schedule = null;

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Practical exam ${passed ? "passed" : "failed"}.`,
      application,
    });

  } catch (err) {
    console.error("Practical exam marking error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const markLicenseCardReady = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.currentStep !== "practical_exam_completed") {
      return res.status(400).json({
        success: false,
        message: "Application is not ready for license issuance.",
      });
    }

    const existingLicense = await License.findOne({
      application: application._id,
    });

    if (existingLicense) {
      return res.status(409).json({
        success: false,
        message: "License has already been issued.",
        license: existingLicense,
      });
    }

    const issueDate = new Date();

    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(
      expiryDate.getFullYear() + 5
    );

    const licenseNumber = `NP-${Date.now()}`;

    const license = await License.create({
      application: application._id,
      user: application.user,

      licenseNumber,

      fullName: application.fullName,

      dateOfBirth: application.dateOfBirth,

      bloodGroup: application.bloodGroup,

      identityNumber: application.identityNumber,

      permanentAddress: application.permanentAddress,

      licenseCategory: application.licenseCategory,

      issueDate,

      expiryDate,

      status: "active",
    });

    application.licenseCard.readyAt = issueDate;
    application.currentStep = "license_card_ready";

    await application.save();



    if (!existingLicense) {

    }

    return res.status(200).json({
      success: true,
      message: "License card marked as ready and digital license created successfully.",
      license,
      application,
    });

  } catch (err) {
    console.error("License card ready marking error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const collectLicneseCard = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.currentStep !== "license_card_ready") {
      return res.status(400).json({
        success: false,
        message: "License card is not ready.",
      });
    }

    application.currentStep = "license_card_collected";
    application.closed = true;
    application.licenseCard.collectedAt = new Date();

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Licese card collected successfully.",
      application,
    });

  } catch (err) {
    console.error("License card collect error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

export { markBiometricResult, markWrittenExamResult, markPracticalExamResult, markLicenseCardReady, collectLicneseCard};