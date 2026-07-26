import Document from "../models/Document.js";

const uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const uploadedFile = req.files[0];
    const fieldName = uploadedFile.fieldname;

    const validFields = ["identityCard", "passportSizePhoto", "bloodGroupReport"];

    if (!validFields.includes(fieldName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid document field: '${fieldName}'`
      });
    }

    const updateQuery = {
      [fieldName]: {
        url: uploadedFile.path,
        publicId: uploadedFile.filename,
        status: "pending"
      }
    };

    const document = await Document.findOneAndUpdate(
      { user: userId },
      { $set: updateQuery },
      { returnDocument: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: `${fieldName} uploaded successfully.`
    });
  } catch (err) {
    console.error("Upload Error: ", err);
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`
    });
  }
};

export { uploadDocument };