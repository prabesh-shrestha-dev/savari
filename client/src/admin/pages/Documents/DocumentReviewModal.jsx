import { useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import "./DocumentReviewModal.css";

export default function DocumentReviewModal({
  document,
  onClose,
  onDocumentUpdate,
}) {
  const axiosPrivate = useAxiosPrivate();

  const [localDocument, setLocalDocument] =
    useState(document);

  const updateDocumentStatus = async (
    documentType,
    status
  ) => {
    const updatedDocument = {
      ...localDocument,
      [documentType]: {
        ...localDocument[documentType],
        status,
      },
    };

    setLocalDocument(updatedDocument);
    onDocumentUpdate(updatedDocument);

    try {
      await axiosPrivate.patch(
        `/documents/admin/${document.user._id}/${documentType}`,
        {
          status,
        }
      );

    } catch (err) {
      console.error(
        "Failed to update document:",
        err
      );

      setLocalDocument(document);
      onDocumentUpdate(document);
    }
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
    title,
    type,
    data
  ) => {
    const status =
      data?.status || "not_uploaded";

    const canReview =
      status !== "approved" &&
      status !== "rejected";


    return (
      <div className="document-item">

        <div className="document-header">

          <div>
            <h3>
              {title}
            </h3>

            <span
              className={`modal-status ${status}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>

        </div>


        <div className="document-actions">

          {data?.url ? (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="view-button"
            >
              View Document
            </a>
          ) : (
            <span className="no-document">
              No Document
            </span>
          )}


          {canReview && (
            <div className="review-actions">

              <button
                className="approve-button"
                onClick={() =>
                  updateDocumentStatus(
                    type,
                    "approved"
                  )
                }
              >
                Approve
              </button>


              <button
                className="reject-button"
                onClick={() =>
                  updateDocumentStatus(
                    type,
                    "rejected"
                  )
                }
              >
                Reject
              </button>

            </div>
          )}

        </div>

      </div>
    );
  };


  const documentsStatus = [
    localDocument.identityCard?.status,
    localDocument.passportSizePhoto?.status,
    localDocument.bloodGroupReport?.status,
  ];


  const approvedCount =
    documentsStatus.filter(
      (status) =>
        status === "approved"
    ).length;


  return (
    <div className="document-modal-overlay">

      <div className="document-modal">

        <div className="modal-top">

          <div>

            <h2>
              {localDocument.user?.fullname}
            </h2>

            <p>
              {localDocument.user?.identifier}
            </p>

          </div>


          <button
            className="close-modal"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <div className="approval-progress">

          <span>
            {approvedCount}/3 Documents Approved
          </span>

          <div className="progress-track">

            <div
              className="progress-value"
              style={{
                width:
                  `${(approvedCount / 3) * 100}%`,
              }}
            />

          </div>

        </div>


        <div className="documents-modal-list">

          {renderDocument(
            "Citizenship / NID",
            "identityCard",
            localDocument.identityCard
          )}

          {renderDocument(
            "Passport Size Photo",
            "passportSizePhoto",
            localDocument.passportSizePhoto
          )}

          {renderDocument(
            "Blood Group Report",
            "bloodGroupReport",
            localDocument.bloodGroupReport
          )}

        </div>


        <div className="modal-bottom">

          <button
            className="done-button"
            onClick={onClose}
          >
            Done
          </button>

        </div>

      </div>

    </div>
  );
}