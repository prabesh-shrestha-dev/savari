import "./ApplicationProgress.css";

const steps = [
  {
    key: "application",
    label: "Application",
  },
  {
    key: "biometric",
    label: "Biometric",
  },
  {
    key: "written",
    label: "Written Exam",
  },
  {
    key: "practical",
    label: "Practical Exam",
  },
  {
    key: "license",
    label: "License Card",
  },
];

const getCurrentIndex = (currentStep) => {
  if (currentStep.startsWith("application")) {
    return 0;
  }

  if (currentStep.startsWith("biometric")) {
    return 1;
  }

  if (currentStep.startsWith("written_exam")) {
    return 2;
  }

  if (currentStep.startsWith("practical_exam")) {
    return 3;
  }

  if (currentStep.startsWith("license_card")) {
    return 4;
  }

  return 0;
};

export default function ApplicationProgress({
  application,
}) {
  const currentIndex = getCurrentIndex(
    application.currentStep
  );

  return (
    <section className="application-progress-card">
      <div className="progress-header">
        <div>
          <h2>Application Progress</h2>
          <p>
            Current status:{" "}
            <strong>
              {application.currentStep.replaceAll("_", " ")}
            </strong>
          </p>
        </div>
      </div>

      <div className="progress-steps">
        {steps.map((step, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div
              key={step.key}
              className={`progress-step ${
                completed ? "completed" : ""
              } ${active ? "active" : ""}`}
            >
              <div className="progress-circle">
                {completed ? "✓" : index + 1}
              </div>

              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}