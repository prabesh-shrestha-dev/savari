import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";

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

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axiosPrivate.get("/documents/me");

      setDocuments(response.data.documents);

    } catch (err) {
      console.error("Failed to fetch documents:", err);

      if (err.response?.status === 404) {
        // No Document record yet
        setDocuments({});
      } else {
        setStatusMessage(
          err.response?.data?.message ||
          "Failed to load documents."
        );
      }
    }
  };

  const handleFileChange = (fieldName, file) => {
    setFiles((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  const handleUpload = async (e, fieldName) => {
    e.preventDefault();

    const file = files[fieldName];

    if (!file) {
      setStatusMessage(
        `Please select a file for ${fieldName} first.`
      );
      return;
    }

    const formData = new FormData();
    formData.append(fieldName, file);

    setLoadingField(fieldName);
    setStatusMessage("");

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

      if (response.status === 200 || response.status === 201) {
        setStatusMessage(
          `${fieldName} uploaded successfully.`
        );

        // Fetch updated document status
        await fetchDocuments();

        // Clear selected file
        setFiles((prev) => ({
          ...prev,
          [fieldName]: null,
        }));
      }

    } catch (err) {
      console.error("Upload error:", err);

      setStatusMessage(
        err.response?.data?.message ||
        "Upload failed. Please try again."
      );

    } finally {
      setLoadingField(null);
    }
  };

  const renderDocument = (
    fieldName,
    title,
    accept
  ) => {
    const document = documents?.[fieldName];

    // If no document exists, treat it as not_uploaded
    const status = document?.status || "not_uploaded";

    return (
      <div className="document-card">
        <h2>{title}</h2>

        {/* STATUS */}
        <p>
          Status:{" "}
          <strong>
            {status}
          </strong>
        </p>

        {/* PENDING / APPROVED / REJECTED */}
        {document?.url && (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Document
          </a>
        )}

        {/* NOT UPLOADED */}
        {status === "not_uploaded" && (
          <form
            onSubmit={(e) =>
              handleUpload(e, fieldName)
            }
          >
            <input
              type="file"
              accept={accept}
              onChange={(e) =>
                handleFileChange(
                  fieldName,
                  e.target.files[0]
                )
              }
            />

            <button
              type="submit"
              disabled={
                loadingField === fieldName
              }
            >
              {loadingField === fieldName
                ? "Uploading..."
                : "Upload"}
            </button>
          </form>
        )}

        {/* REJECTED */}
        {status === "rejected" && (
          <form
            onSubmit={(e) =>
              handleUpload(e, fieldName)
            }
          >
            <p>
              Your document was rejected.
              Please upload a new document.
            </p>

            <input
              type="file"
              accept={accept}
              onChange={(e) =>
                handleFileChange(
                  fieldName,
                  e.target.files[0]
                )
              }
            />

            <button
              type="submit"
              disabled={
                loadingField === fieldName
              }
            >
              {loadingField === fieldName
                ? "Updating..."
                : "Update Document"}
            </button>
          </form>
        )}

        {/* PENDING */}
        {status === "pending" && (
          <p>
            Your document is currently being reviewed.
          </p>
        )}

        {/* APPROVED */}
        {status === "approved" && (
          <p>
            Your document has been approved.
          </p>
        )}
      </div>
    );
  };

  if (documents === null) {
    return <p>Loading documents...</p>;
  }

  return (
    <div className="documents-page">
      <h1>My Documents</h1>

      {statusMessage && (
        <p>
          {statusMessage}
        </p>
      )}

      {renderDocument(
        "identityCard",
        "Citizenship or NID",
        "image/*,.pdf"
      )}

      {renderDocument(
        "passportSizePhoto",
        "Passport-size Photo",
        "image/*"
      )}

      {renderDocument(
        "bloodGroupReport",
        "Blood Group Report",
        "image/*,.pdf"
      )}
    </div>
  );
}