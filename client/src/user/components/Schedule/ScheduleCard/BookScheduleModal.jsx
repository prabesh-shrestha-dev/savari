import "./BookScheduleModal.css";

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};


export default function BookScheduleModal({
  schedule,
  type,
  slot,
  loading,
  onConfirm,
  onClose,
}) {

  const getExamName = () => {
    if (type === "biometric") {
      return "Biometric Verification";
    }

    if (type === "written_exam") {
      return "Written Examination";
    }

    return "Practical Examination";
  };


  return (
    <div 
      className="book-modal-overlay" 
      style={{
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >

      <div className="book-modal">

        <div className="book-modal-header">
          <h2>
            Confirm Schedule Booking
          </h2>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>


        <div className="book-modal-body">

          <div className="booking-info">

            <div className="info-row">
              <span>
                Examination
              </span>

              <strong>
                {getExamName()}
              </strong>
            </div>


            <div className="info-row">
              <span>
                Date
              </span>

              <strong>
                {formatDate(schedule?.date)}
              </strong>
            </div>


            {slot && (
              <div className="info-row">
                <span>
                  Time Slot
                </span>

                <strong>
                  {slot.startTime} - {slot.endTime}
                </strong>
              </div>
            )}

          </div>


          <div className="warning-box">
            <p>
              Are you sure you want to book this
              examination schedule?
            </p>

            <small>
              Once booked, please arrive at the
              office on the selected date.
            </small>
          </div>


        </div>


        <div className="book-modal-actions">

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
              ? "Booking..."
              : "Confirm Booking"}
          </button>

        </div>


      </div>

    </div>
  );
}