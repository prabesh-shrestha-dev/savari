import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import "./DocumentsReview.css";

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

  const updateDocumentStatus = async (
    userId,
    documentType,
    status
  ) => {
    try {
      setActionLoading(
        `${userId}-${documentType}-${status}`
      );

      setError("");

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
      console.error(
        "Failed to update document:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update document status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getStatus = (document) => {
    return document?.status || "not_uploaded";
  };

  const getStatusLabel = (status) => {
    const labels = {
      approved: "Approved",
      rejected: "Rejected",
      pending: "Pending",
      not_uploaded: "Not Uploaded",
    };

    return labels[status] || status;
  };

  const renderDocument = (
    document,
    userId,
    documentType,
    label
  ) => {
    const status = getStatus(document);

    const approveKey =
      `${userId}-${documentType}-approved`;

    const rejectKey =
      `${userId}-${documentType}-rejected`;

    const isApproving =
      actionLoading === approveKey;

    const isRejecting =
      actionLoading === rejectKey;

    return (
      <div className="document-review-item">

        <div className="document-info">

          <div className="document-icon">
            {document ? "📄" : "—"}
          </div>

          <div className="document-details">

            <h4>{label}</h4>

            <span
              className={`document-status ${status}`}
            >
              <span className="status-dot"></span>

              {getStatusLabel(status)}
            </span>

          </div>

        </div>

        <div className="document-actions">

          {document?.url ? (
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="view-document-btn"
            >
              View Document
            </a>
          ) : (
            <span className="not-available">
              No document
            </span>
          )}

          <button
            type="button"
            className="approve-btn"
            disabled={
              !document ||
              isApproving ||
              isRejecting
            }
            onClick={() =>
              updateDocumentStatus(
                userId,
                documentType,
                "approved"
              )
            }
          >
            {isApproving
              ? "Approving..."
              : "Approve"}
          </button>

          <button
            type="button"
            className="reject-btn"
            disabled={
              !document ||
              isApproving ||
              isRejecting
            }
            onClick={() =>
              updateDocumentStatus(
                userId,
                documentType,
                "rejected"
              )
            }
          >
            {isRejecting
              ? "Rejecting..."
              : "Reject"}
          </button>

        </div>
      </div>
    );
  };

  const visibleDocuments = documents.filter(
    (document) => {
      const identityStatus = getStatus(
        document.identityCard
      );

      const photoStatus = getStatus(
        document.passportSizePhoto
      );

      const bloodStatus = getStatus(
        document.bloodGroupReport
      );

      const allApproved =
        identityStatus === "approved" &&
        photoStatus === "approved" &&
        bloodStatus === "approved";

      const allRejected =
        identityStatus === "rejected" &&
        photoStatus === "rejected" &&
        bloodStatus === "rejected";

      return !allApproved && !allRejected;
    }
  );

  if (loading) {
    return (
      <div className="documents-review-page">
        <div className="review-loading">
          <div className="loading-spinner"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-review-page">

      <div className="review-page-header">

        <div>
          <h1>Documents Review</h1>

          <p>
            Review and verify documents submitted
            by license applicants.
          </p>
        </div>

        <div className="document-count">
          <span>{visibleDocuments.length}</span>
          <small>
            {visibleDocuments.length === 1
              ? "Applicant"
              : "Applicants"}
          </small>
        </div>

      </div>


      {error && (
        <div className="error-message">
          <span>!</span>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}


      {visibleDocuments.length === 0 ? (
        <div className="empty-state">

          <div className="empty-icon">
            ✓
          </div>

          <h2>No documents to review</h2>

          <p>
            All submitted documents have been
            reviewed or there are no documents
            waiting for review.
          </p>

        </div>
      ) : (

        <div className="documents-list">

          {visibleDocuments.map((document) => {

            const userId =
              document.user._id;

            const identityStatus =
              getStatus(
                document.identityCard
              );

            const photoStatus =
              getStatus(
                document.passportSizePhoto
              );

            const bloodStatus =
              getStatus(
                document.bloodGroupReport
              );

            const approvedCount = [
              identityStatus,
              photoStatus,
              bloodStatus,
            ].filter(
              (status) =>
                status === "approved"
            ).length;

            return (
              <div
                className="user-document-card"
                key={document._id}
              >

                {/* User Header */}
                <div className="user-card-header">

                  <div className="user-info">

                    <div className="user-avatar">
                      {document.user.fullname
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <h2>
                        {document.user.fullname}
                      </h2>

                      <p>
                        {document.user.identifier}
                      </p>
                    </div>

                  </div>

                  <div className="review-progress">

                    <span>
                      {approvedCount}/3 approved
                    </span>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width:
                            `${(approvedCount / 3) * 100}%`,
                        }}
                      ></div>
                    </div>

                  </div>

                </div>


                <div className="documents-container">

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

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}
