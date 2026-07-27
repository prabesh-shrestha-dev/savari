import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";

export default function DocumentsReview() {
  const axiosPrivate = useAxiosPrivate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosPrivate.get("/documents/admin");

      setDocuments(response.data.documents || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentStatus = async (userId, documentType, status) => {
    try {
      setActionLoading(`${userId}-${documentType}-${status}`);

      await axiosPrivate.patch(
        `/documents/admin/${userId}/${documentType}`,
        {
          status,
        }
      );

      setDocuments((prevDocuments) =>
        prevDocuments.map((document) => {
          if (document.user._id !== userId) {
            return document;
          }

          return {
            ...document,
            [documentType]: {
              ...document[documentType],
              status,
            },
          };
        })
      );
    } catch (err) {
      console.error("Failed to update document:", err);

      setError(
        err.response?.data?.message ||
        "Failed to update document status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const renderDocument = (document, userId, documentType, label) => {
    if (!document) {
      return (
        <div className="document-item">
          <div>
            <strong>{label}</strong>
            <p>Not uploaded</p>
          </div>
        </div>
      );
    }

    const status = document.status || "not_uploaded";

    return (
      <div className="document-item">
        <div>
          <strong>{label}</strong>

          <p>
            Status:{" "}
            <span className={`status ${status}`}>
              {status}
            </span>
          </p>
        </div>

        <div className="document-actions">
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>

          <button
            type="button"
            disabled={
              actionLoading ===
              `${userId}-${documentType}-approved`
            }
            onClick={() =>
              updateDocumentStatus(
                userId,
                documentType,
                "approved"
              )
            }
          >
            {actionLoading ===
            `${userId}-${documentType}-approved`
              ? "Approving..."
              : "Approve"}
          </button>

          <button
            type="button"
            disabled={
              actionLoading ===
              `${userId}-${documentType}-rejected`
            }
            onClick={() =>
              updateDocumentStatus(
                userId,
                documentType,
                "rejected"
              )
            }
          >
            {actionLoading ===
            `${userId}-${documentType}-rejected`
              ? "Rejecting..."
              : "Reject"}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <h1>Loading documents...</h1>;
  }

  return (
    <div className="documents-review">
      <h1>Documents Review</h1>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <div className="documents-list">
          {documents
            .filter((document) => {
              return !(
                (document.identityCard?.status === "approved" &&
                document.passportSizePhoto?.status === "approved" &&
                document.bloodGroupReport?.status === "approved") ||
                (document.identityCard?.status === "rejected" &&
                document.passportSizePhoto?.status === "rejected" &&
                document.bloodGroupReport?.status === "rejected")
              );
            }).map((document) => {
            const userId = document.user._id;

            return (
              <div
                className="user-document-card"
                key={document._id}
              >
                <h2>
                  {document.user.fullname}
                </h2>

                <p>
                  {document.user.identifier}
                </p>

                {renderDocument(
                  document.identityCard,
                  userId,
                  "identityCard",
                  "Citizenship / NID"
                )}

                {renderDocument(
                  document.passportSizePhoto,
                  userId,
                  "passportSizePhoto",
                  "Passport-size Photo"
                )}

                {renderDocument(
                  document.bloodGroupReport,
                  userId,
                  "bloodGroupReport",
                  "Blood Group Report"
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}