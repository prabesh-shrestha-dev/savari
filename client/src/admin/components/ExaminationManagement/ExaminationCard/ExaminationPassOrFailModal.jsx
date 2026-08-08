import "./ExaminationPassOrFailModal.css";

export default function ExaminationPassOrFailModal({
  application,
  result,
  onConfirm,
  onClose,
  loading,
}) {
  const fullName =
    application.fullName ||
    application.user?.fullname ||
    "Unknown Candidate";

  const stage = {
    biometric_pending: "Biometric Verification",
    written_exam_pending: "Written Examination",
    practical_exam_pending: "Practical Examination",
  }[application.currentStep];

  return (
    <div className="exam-result-overlay">
      <div className="exam-result-modal">

        <div className="exam-modal-header">
          <h2>
            Confirm Examination Result
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>


        <div className="exam-modal-content">

          <p>
            Candidate
          </p>

          <h3>
            {fullName}
          </h3>


          <div className="exam-info">

            <div>
              <span>
                Examination
              </span>

              <strong>
                {stage}
              </strong>
            </div>


            <div>
              <span>
                Result
              </span>

              <strong
                className={
                  result
                    ? "pass-text"
                    : "fail-text"
                }
              >
                {result
                  ? "Passed"
                  : "Failed"}
              </strong>
            </div>

          </div>


          <p className="confirmation-text">
            Are you sure you want to mark this
            candidate as{" "}
            {result ? "passed" : "failed"}?
          </p>

        </div>


        <div className="exam-modal-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>


          <button
            type="button"
            className={
              result
                ? "confirm-pass-button"
                : "confirm-fail-button"
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Confirm"}
          </button>

        </div>

      </div>
    </div>
  );
}