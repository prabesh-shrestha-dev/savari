import "./CurrentScheduleCard.css";

const scheduleInfo = [
  {
    key: "biometric",
    label: "Biometric Verification",
  },
  {
    key: "writtenExam",
    label: "Written Examination",
  },
  {
    key: "practicalExam",
    label: "Practical Examination",
  },
];

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};

export default function CurrentScheduleCard({
  schedules,
}) {
  const hasSchedule = scheduleInfo.some(
    (item) => schedules?.[item.key]?.schedule
  );

  if (!hasSchedule) {
    return (
      <section className="current-schedule-card empty">
        <h2>No Examination Scheduled</h2>

        <p>
          You currently do not have any upcoming
          examination scheduled.
        </p>
      </section>
    );
  }

  return (
    <section className="current-schedule-card">
      <div className="section-title">
        <h2>Your Scheduled Examinations</h2>
        <span>Upcoming</span>
      </div>

      <div className="scheduled-list">
        {scheduleInfo.map((item) => {
          const data = schedules?.[item.key];

          if (!data?.schedule) {
            return null;
          }

          const slot = data.slot;

          return (
            <div
              className="scheduled-item"
              key={item.key}
            >
              <div className="scheduled-icon">
                {item.key === "biometric"
                  ? "B"
                  : item.key === "writtenExam"
                  ? "W"
                  : "P"}
              </div>

              <div className="scheduled-details">
                <h3>{item.label}</h3>

                <p>
                  {formatDate(data.schedule.date)}
                </p>

                {slot && (
                  <p>
                    {slot.startTime} - {slot.endTime}
                  </p>
                )}
              </div>

              <span className="scheduled-status">
                Scheduled
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}