import "./ScheduleHeader.css";

export default function ScheduleHeader() {
  return (
    <div className="schedule-header">
      <div>

        <h1>My Examination <span style={{
          color: "#0048FF"
        }}>Schedule</span></h1>

        <p>
          View your upcoming examinations and book available
          examination dates.
        </p>
      </div>
    </div>
  );
}