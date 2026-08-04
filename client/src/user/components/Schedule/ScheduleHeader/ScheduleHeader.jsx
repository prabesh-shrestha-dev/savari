import "./ScheduleHeader.css";

export default function ScheduleHeader() {
  return (
    <div className="schedule-header">
      <div>
        <span className="schedule-eyebrow">
          Examination Management
        </span>

        <h1>My Examination Schedule</h1>

        <p>
          View your upcoming examinations and book available
          examination dates.
        </p>
      </div>
    </div>
  );
}