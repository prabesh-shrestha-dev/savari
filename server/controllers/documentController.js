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

    const validFields = [
      "identityCard", 
      "passportSizePhoto", 
      "bloodGroupReport"
    ];

    if (!validFields.includes(fieldName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid document field: '${fieldName}'`
      });
    }

    const existingDocument = await Document.findOne({
      user: userId,
    });

    if (existingDocument?.[fieldName]) {
      const currentStatus = existingDocument[fieldName].status;

      if (currentStatus !== "rejected" && currentStatus !== "not_uploaded") {
        return res.status(403).json({
          success: false,
          message: `You cannot update this document because its status is '${currentStatus}'.`,
        });
      }
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

const getMyDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    const documents = await Document.findOne({
      user: userId,
    }).lean();

    return res.status(200).json({
      success: true,
      documents
    });

  } catch (err) {
    console.error("Get My Documents Error: ", err);

    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`
    });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document
      .find()
      .populate("user", "fullname identifier");

    return res.status(200).json({
      success: true,
      documents,
    });

  } catch (err) {
    console.error("Get All Documents Error: ", err);

    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`
    });
  }
};

const updateDocumentStatus = async (req, res) => {
  try {
    const { userId, documentType } = req.params;
    const { status } = req.body;

    const validDocumentTypes = [
      "identityCard",
      "passportSizePhoto",
      "bloodGroupReport",
    ];

    const validStatuses = [
      "approved",
      "rejected",
    ];

    if (!validDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document type.",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document status."
      });
    }

    const document = await Document.findOne({
      user: userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document record not found.",
      })
    }

    if (!document[documentType]?.url) {
      return res.status(404).json({
        success: false,
        message: "This document has not been uploaded.",
      });
    }

    document[documentType].status = status;

    await document.save();

    return res.status(200).json({
      success: true,
      message: `${documentType} ${status} successfullly.`,
    });

  } catch (err) {
    console.error("Update Document Status Error: ", err);

    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`,
    });
  }
};

export { uploadDocument, getMyDocuments, getAllDocuments, updateDocumentStatus };