import License from "../models/Licnese.js";
import Document from "../models/Document.js";

const getMyLicense = async (req, res) => {
  try {
    const userId = req.user.id;

    const license = await License.findOne({
      user: userId,
    })
      .populate("application", "currentStep licenseCategory");

    if (!license) {
      return res.status(404).json({
        success: false,
        message: "No license found.",
      });
    }

    const document = await Document.findOne({
      user: userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "No document found.",
      });
    }

    const licenseData = license.toObject();

    licenseData.passportSizePhoto = document?.passportSizePhoto?.url || null;

    return res.status(200).json({
      success: true,
      license: licenseData,
    });

  } catch (err) {
    console.error("Get my license error: ", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

export { getMyLicense };