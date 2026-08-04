import "./ScheduleFilters.css";

export default function ScheduleFilters({
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange,
}) {
  return (
    <div className="schedule-filters">
      <div className="filter-group">
        <label>
          Schedule Type
        </label>

        <select
          value={typeFilter}
          onChange={(e) =>
            onTypeChange(e.target.value)
          }
        >
          <option value="all">
            All Types
          </option>

          <option value="biometric">
            Biometric
          </option>

          <option value="written_exam">
            Written Exam
          </option>

          <option value="practical_exam">
            Practical Exam
          </option>
        </select>
      </div>

      <div className="filter-group">
        <label>
          Schedule Status
        </label>

        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusChange(e.target.value)
          }
        >
          <option value="all">
            All Statuses
          </option>

          <option value="upcoming">
            Upcoming
          </option>

          <option value="ongoing">
            Ongoing
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>
      </div>
    </div>
  );
}