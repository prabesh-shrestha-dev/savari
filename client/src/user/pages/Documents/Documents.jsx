import { useCallback, useEffect, useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import "./Documents.css";

const documentConfig = [
  {
    fieldName: "identityCard",
    title: "Citizenship / NID",
    description:
      "Upload a clear copy of your citizenship certificate or National ID.",
    accept: "image/*",
  },
  {
    fieldName: "passportSizePhoto",
    title: "Passport-size Photo",
    description:
      "Upload a recent passport-size photograph with a clear background.",
    accept: "image/*",
  },
  {
    fieldName: "bloodGroupReport",
    title: "Blood Group Report",
    description:
      "Upload a valid blood group report from a recognized medical provider.",
    accept: "image/*",
  },
];

export default function Documents() {
  const axiosPrivate = useAxiosPrivate();

  const [documents, setDocuments] = useState(null);

  const [files, setFiles] = useState({
    identityCard: null,
    passportSizePhoto: null,
    bloodGroupReport: null,
  });

  const [loadingField, setLoadingField] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const fetchDocuments = useCallback(async () => {
    try {
      setError("");

      const response = await axiosPrivate.get("/documents/me");

      setDocuments(response.data.documents || {});
    } catch (err) {
      console.error(
        "Failed to fetch documents:",
        err
      );

      if (err.response?.status === 404) {
        setDocuments({});
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load your documents."
      );
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileChange = (fieldName, file) => {
    if (!file) {
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

    setStatusMessage("");
    setError("");
  };

  const handleUpload = async (e, fieldName) => {
    e.preventDefault();

    const file = files[fieldName];

    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();

    formData.append(fieldName, file);

    setLoadingField(fieldName);
    setStatusMessage("");
    setError("");

    try {
      const response = await axiosPrivate.post(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (
        response.status === 200 ||
        response.status === 201
      ) {
        setStatusMessage(
          "Document uploaded successfully."
        );

        await fetchDocuments();

        setFiles((prev) => ({
          ...prev,
          [fieldName]: null,
        }));
      }
    } catch (err) {
      console.error(
        "Document upload error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Upload failed. Please try again."
      );
    } finally {
      setLoadingField(null);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "Approved";

      case "pending":
        return "Under Review";

      case "rejected":
        return "Rejected";

      default:
        return "Not Uploaded";
    }
  };

  const renderDocumentCard = ({
    fieldName,
    title,
    description,
    accept,
  }) => {
    const document = documents?.[fieldName];

    const status =
      document?.status || "not_uploaded";

    const selectedFile = files[fieldName];

    const isUploading =
      loadingField === fieldName;

    const canUpload =
      status === "not_uploaded" ||
      status === "rejected";

    return (
      <div className="document-card">

        <div className="document-card-header">
          <div className="document-title-wrapper">
            <h2>{title}</h2>

            <span
              className={`document-status status-${status}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>
        </div>


        <p className="document-description">
          {description}
        </p>


        {document?.url && (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="view-document-btn"
          >
            View Uploaded Document
          </a>
        )}


        {status === "rejected" &&
          document?.rejection?.reason && (
            <div className="rejection-message">
              <strong>
                Rejection reason
              </strong>

              <p>
                {document.rejection.reason}
              </p>
            </div>
          )}


        {canUpload && (
          <form
            className="document-upload-form"
            onSubmit={(e) =>
              handleUpload(e, fieldName)
            }
          >

            <label className="file-input-label">
              <span>
                {selectedFile
                  ? selectedFile.name
                  : "Choose a file"}
              </span>

              <input
                type="file"
                accept={accept}
                onChange={(e) =>
                  handleFileChange(
                    fieldName,
                    e.target.files?.[0]
                  )
                }
                disabled={isUploading}
              />
            </label>


            {selectedFile && (
              <p className="selected-file">
                Selected: {selectedFile.name}
              </p>
            )}


            <button
              type="submit"
              className="upload-btn"
              disabled={
                isUploading ||
                !selectedFile
              }
            >
              {isUploading
                ? "Uploading..."
                : status === "rejected"
                  ? "Update Document"
                  : "Upload Document"}
            </button>

          </form>
        )}


        {status === "pending" && (
          <div className="document-info pending-info">
            <span className="info-icon">
              ⏳
            </span>

            <p>
              Your document is currently being
              reviewed by the administration.
            </p>
          </div>
        )}


        {status === "approved" && (
          <div className="document-info approved-info">
            <span className="info-icon">
              ✓
            </span>

            <p>
              Your document has been approved.
            </p>
          </div>
        )}

      </div>
    );
  };


  if (documents === null) {
    return (
      <div className="documents-page">
        <div className="documents-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading your documents...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="documents-page">

      <div className="documents-page-header">
        <div>
          <h1>My <span style={{
            color: "#0048FF"
          }}>Documents</span></h1>

          <p>
            Upload and manage the documents
            required for your license application.
          </p>
        </div>
      </div>


      {statusMessage && (
        <div className="success-message">
          <span>✓</span>

          <p>{statusMessage}</p>
        </div>
      )}


      {error && (
        <div className="error-message">
          <span>!</span>

          <p>{error}</p>
        </div>
      )}


      <div className="documents-grid">
        {documentConfig.map((document) => (
          <div key={document.fieldName}>
            {renderDocumentCard(document)}
          </div>
        ))}
      </div>

      <div className="document-requirements-box">

        <h3>
          Please make sure you have the following documents before applying:
        </h3>

        <ul>
          <li>Original Citizenship Certificate</li>
          <li>Photocopy of Citizenship Certificate</li>
          <li>Printed Online Application Form</li>
          <li>Blood Group Certificate/Card</li>
          <li>Passport-size Photographs (2–4 copies)</li>
          <li>Medical Fitness Certificate (if required)</li>
          <li>Original ID for Verification</li>
          <li>
            Previous Driving License (only for category addition or renewal)
          </li>
        </ul>

      </div>

    </div>
  );
}