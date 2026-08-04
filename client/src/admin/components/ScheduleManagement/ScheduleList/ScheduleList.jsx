import ScheduleCard from "../ScheduleCard/ScheduleCard";
import "./ScheduleList.css";

export default function ScheduleList({
  schedules,
  loading,
  onEdit,
  onCancel,
  cancellingId,
}) {
  if (loading) {
    return (
      <div className="schedule-list-message">
        Loading schedules...
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="schedule-list-empty">
        <h3>
          No schedules found
        </h3>

        <p>
          There are no schedules matching
          your selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="schedule-list">
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule._id}
          schedule={schedule}
          onEdit={onEdit}
          onCancel={onCancel}
          cancellingId={cancellingId}
        />
      ))}
    </div>
  );
}