import "./ApplicationConfirmModal.css";

export default function ApplicationConfirmModal({
  open,
  onClose,
  onConfirm,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-card">
        <h2>Apply for License?</h2>

        <p>
          Are you sure you want to submit your driving
          license application?
        </p>

        <div className="confirm-note">
          <strong>Note:</strong>

          <ul>
            <li>
              Make sure all information is correct.
            </li>

            <li>
              Submitted applications cannot be edited.
            </li>

            <li>
              Your application will be reviewed by the
              administrator.
            </li>
          </ul>
        </div>

        <div className="confirm-actions">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="confirm-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Yes, Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}