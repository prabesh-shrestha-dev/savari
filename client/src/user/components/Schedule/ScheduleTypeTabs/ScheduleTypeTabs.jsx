import "./ScheduleTypeTabs.css";

const tabs = [
  {
    key: "biometric",
    label: "Biometric",
  },
  {
    key: "written_exam",
    label: "Written Exam",
  },
  {
    key: "practical_exam",
    label: "Practical Exam",
  },
];

const getEligibility = (
  type,
  application,
  mySchedules
) => {
  if (type === "biometric") {
    return [
      "application_approved",
      "biometric_failed",
    ].includes(application.currentStep);
  }

  if (type === "written_exam") {
    return (
      application.currentStep ===
        "biometric_completed" &&
      !mySchedules?.writtenExam?.schedule
    );
  }

  if (type === "practical_exam") {
    return (
      [
        "written_exam_completed",
        "practical_exam_failed",
      ].includes(application.currentStep) &&
      application.practicalExam.attempts < 3 &&
      !mySchedules?.practicalExam?.schedule
    );
  }

  return false;
};

export default function ScheduleTypeTabs({
  selectedType,
  onTypeChange,
  application,
  mySchedules,
}) {
  return (
    <div className="schedule-type-tabs">
      {tabs.map((tab) => {
        const eligible = getEligibility(
          tab.key,
          application,
          mySchedules
        );

        const hasCurrentSchedule =
          tab.key === "biometric"
            ? mySchedules?.biometric?.schedule
            : tab.key === "written_exam"
            ? mySchedules?.writtenExam?.schedule
            : mySchedules?.practicalExam?.schedule;

        return (
          <button
            key={tab.key}
            type="button"
            disabled={!eligible || hasCurrentSchedule}
            className={`schedule-type-tab ${
              selectedType === tab.key
                ? "active"
                : ""
            }`}
            onClick={() =>
              onTypeChange(tab.key)
            }
          >
            <span>{tab.label}</span>

            {hasCurrentSchedule && (
              <small>Scheduled</small>
            )}

            {!eligible &&
              !hasCurrentSchedule && (
                <small>Unavailable</small>
              )}
          </button>
        );
      })}
    </div>
  );
}