import "./ScheduleCard.css";

const formatType = (type) => {
  if (type === "biometric") {
    return "Biometric";
  }

  if (type === "written_exam") {
    return "Written Exam";
  }

  if (type === "practical_exam") {
    return "Practical Exam";
  }

  return type;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};

export default function ScheduleCard({
  schedule,
  onEdit,
  onCancel,
  cancellingId,
}) {
  const isCancelled =
    schedule.status === "cancelled";

  const isCompleted =
    schedule.status === "completed";

  const canCancel =
    !isCancelled &&
    !isCompleted;

  return (
    <div className="schedule-card">

      <div className="schedule-card-header">
        <div>
          <span className="schedule-type">
            {formatType(schedule.type)}
          </span>

          <h2>
            {formatDate(schedule.date)}
          </h2>
        </div>

        <span
          className={`schedule-status ${schedule.status}`}
        >
          {schedule.status}
        </span>
      </div>

      {schedule.type === "biometric" &&
        schedule.biometricCapacity && (
          <div className="capacity-section">
            <h3>
              Biometric Capacity
            </h3>

            <CapacityBar
              capacity={
                schedule.biometricCapacity.capacity
              }
              booked={
                schedule.biometricCapacity.booked
              }
            />
          </div>
        )}

      {schedule.type === "written_exam" && (
        <div className="capacity-section">
          <h3>
            Examination Slots
          </h3>

          <div className="written-slots">
            {schedule.slots?.map(
              (slot) => (
                <div
                  className="written-slot"
                  key={slot._id}
                >
                  <div>
                    <strong>
                      {slot.startTime} -{" "}
                      {slot.endTime}
                    </strong>
                  </div>

                  <CapacityBar
                    capacity={slot.capacity}
                    booked={slot.booked}
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

      {schedule.type === "practical_exam" &&
        schedule.practicalCapacity && (
          <div className="capacity-section">
            <h3>
              Practical Capacity
            </h3>

            <div className="practical-categories">
              {["A", "B", "K", "H"].map(
                (category) => {
                  const data =
                    schedule
                      .practicalCapacity[
                      category
                    ];

                  return (
                    <div
                      className="practical-category"
                      key={category}
                    >
                      <div>
                        <strong>
                          Category {category}
                        </strong>
                      </div>

                      <CapacityBar
                        capacity={
                          data.capacity
                        }
                        booked={
                          data.booked
                        }
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

      <div className="schedule-card-actions">
        <button
          type="button"
          className="edit-btn"
          onClick={() =>
            onEdit(schedule)
          }
          disabled={isCancelled}
        >
          Edit
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={() =>
            onCancel(schedule._id)
          }
          disabled={
            !canCancel ||
            cancellingId ===
              schedule._id
          }
        >
          {cancellingId ===
          schedule._id
            ? "Cancelling..."
            : "Cancel Schedule"}
        </button>
      </div>
    </div>
  );
}

function CapacityBar({
  capacity,
  booked,
}) {
  const percentage =
    capacity > 0
      ? Math.min(
          (booked / capacity) * 100,
          100
        )
      : 0;

  return (
    <div className="capacity-wrapper">
      <div className="capacity-bar">
        <div
          className="capacity-progress"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <span className="capacity-text">
        {booked}/{capacity}
      </span>
    </div>
  );
}