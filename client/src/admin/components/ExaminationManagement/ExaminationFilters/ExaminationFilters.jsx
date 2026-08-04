import "./ExaminationFilters.css";

export default function ExaminationFilters({
  stages,
  selectedStage,
  onStageChange,
}) {
  return (
    <div className="examination-filters">
      <div className="filter-label">
        Examination Stage
      </div>

      <div className="stage-tabs">
        {stages.map((stage) => (
          <button
            key={stage.value}
            type="button"
            className={`stage-tab ${
              selectedStage === stage.value
                ? "active"
                : ""
            }`}
            onClick={() =>
              onStageChange(stage.value)
            }
          >
            {stage.label}
          </button>
        ))}
      </div>
    </div>
  );
}