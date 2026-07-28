import { useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import "./ApplicationReviewModal.css";

export default function ApplicationReviewModal({
  application,
  onClose,
  onReviewSuccess,
}) {
  const axiosPrivate = useAxiosPrivate();

  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const documents = application.documents;

  const handleDecisionSelect = (selectedDecision) => {
    setDecision(selectedDecision);
    setError("");

    // Clear rejection reason when switching to approve
    if (selectedDecision === "approved") {
      setReason("");
    }
  };

  const handleReview = async () => {
    if (!decision) {
      setError("Please select approve or reject.");
      return;
    }

    if (decision === "rejected" && !reason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const reviewData = {
        decision,
      };

      // Only send reason when rejecting
      if (decision === "rejected") {
        reviewData.reason = reason.trim();
      }

      await axiosPrivate.patch(
        `/applications/${application._id}/review`,
        reviewData
      );

      onReviewSuccess();
    } catch (err) {
      console.error(
        "Application review error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to review application."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">

        {/* Header */}
        <div className="review-modal-header">
          <div>
            <h2>Review Application</h2>

            <p>
              Review the applicant's information and
              submitted documents before making a decision.
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>


        {/* Body */}
        <div className="review-modal-body">

          {/* Applicant Information */}
          <section className="review-section">
            <h3>Applicant Information</h3>

            <div className="review-details-grid">

              <div className="review-detail">
                <span>Full Name</span>
                <strong>
                  {application.fullName}
                </strong>
              </div>

              <div className="review-detail">
                <span>Account</span>
                <strong>
                  {application.user?.identifier || "N/A"}
                </strong>
              </div>

              <div className="review-detail">
                <span>Date of Birth</span>
                <strong>
                  {new Date(
                    application.dateOfBirth
                  ).toLocaleDateString()}
                </strong>
              </div>

              <div className="review-detail">
                <span>Identity Number</span>
                <strong>
                  {application.identityNumber}
                </strong>
              </div>

              <div className="review-detail">
                <span>Blood Group</span>
                <strong>
                  {application.bloodGroup}
                </strong>
              </div>

              <div className="review-detail">
                <span>License Category</span>
                <strong>
                  Category {application.licenseCategory}
                </strong>
              </div>

              <div className="review-detail">
                <span>Submitted Date</span>
                <strong>
                  {new Date(
                    application.createdAt
                  ).toLocaleDateString()}
                </strong>
              </div>

            </div>
          </section>


          {/* Address */}
          <section className="review-section">
            <h3>Address</h3>

            <div className="address-details">

              <div>
                <span>Permanent Address</span>

                <p>
                  {application.permanentAddress}
                </p>
              </div>

              <div>
                <span>Temporary Address</span>

                <p>
                  {application.temporaryAddress}
                </p>
              </div>

            </div>
          </section>


          {/* Submitted Documents */}
          <section className="review-section">
            <h3>Submitted Documents</h3>

            <div className="documents-grid">

              {/* Citizenship / NID */}
              <div className="document-card">

                <div className="document-card-content">
                  <h4>Citizenship / NID</h4>

                  <span
                    className={`document-status ${
                      documents?.identityCard?.status ||
                      "not_uploaded"
                    }`}
                  >
                    {documents?.identityCard?.status ||
                      "Not uploaded"}
                  </span>
                </div>

                {documents?.identityCard?.url ? (
                  <a
                    href={
                      documents.identityCard.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-document-btn"
                  >
                    View Document
                  </a>
                ) : (
                  <p className="no-document">
                    Document not uploaded
                  </p>
                )}

              </div>


              {/* Document 2 */}
              <div className="document-card">

                <div className="document-card-content">
                  <h4>Document 2</h4>

                  <span
                    className={`document-status ${
                      documents?.passportSizePhoto?.status ||
                      "not_uploaded"
                    }`}
                  >
                    {documents?.passportSizePhoto?.status ||
                      "Not uploaded"}
                  </span>
                </div>

                {documents?.passportSizePhoto?.url ? (
                  <a
                    href={documents.passportSizePhoto.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-document-btn"
                  >
                    View Document
                  </a>
                ) : (
                  <p className="no-document">
                    Document not uploaded
                  </p>
                )}

              </div>


              {/* Document 3 */}
              <div className="document-card">

                <div className="document-card-content">
                  <h4>Document 3</h4>

                  <span
                    className={`document-status ${
                      documents?.bloodGroupReport?.status ||
                      "not_uploaded"
                    }`}
                  >
                    {documents?.bloodGroupReport?.status ||
                      "Not uploaded"}
                  </span>
                </div>

                {documents?.bloodGroupReport?.url ? (
                  <a
                    href={documents.bloodGroupReport.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-document-btn"
                  >
                    View Document
                  </a>
                ) : (
                  <p className="no-document">
                    Document not uploaded
                  </p>
                )}

              </div>

            </div>
          </section>


          {/* Decision */}
          <section className="review-section">
            <h3>Application Decision</h3>

            <div className="decision-buttons">

              <button
                type="button"
                className={`decision-btn approve ${
                  decision === "approved"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleDecisionSelect("approved")
                }
                disabled={isSubmitting}
              >
                <span className="decision-icon">
                  ✓
                </span>

                <span>
                  Approve Application
                </span>
              </button>


              <button
                type="button"
                className={`decision-btn reject ${
                  decision === "rejected"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleDecisionSelect("rejected")
                }
                disabled={isSubmitting}
              >
                <span className="decision-icon">
                  ×
                </span>

                <span>
                  Reject Application
                </span>
              </button>

            </div>


            {/* Rejection Reason */}
            {decision === "rejected" && (
              <div className="rejection-reason">

                <label htmlFor="rejectionReason">
                  Reason for rejection
                </label>

                <textarea
                  id="rejectionReason"
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value)
                  }
                  placeholder="Explain why this application is being rejected..."
                  rows={4}
                  disabled={isSubmitting}
                />

                <p className="reason-info">
                  A rejection reason is required.
                </p>

              </div>
            )}

          </section>


          {/* Error */}
          {error && (
            <div className="review-error">
              {error}
            </div>
          )}

        </div>


        {/* Footer */}
        <div className="review-modal-footer">

          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="submit-review-btn"
            onClick={handleReview}
            disabled={!decision || isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Decision"}
          </button>

        </div>

      </div>
    </div>
  );
}