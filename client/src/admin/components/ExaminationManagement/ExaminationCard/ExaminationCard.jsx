import { useState } from "react";

import ExaminationPassOrFailModal from "./ExaminationPassOrFailModal";

import "./ExaminationCard.css";

const STAGE_LABELS = {
  biometric_pending: "Biometric Verification",
  written_exam_pending: "Written Examination",
  practical_exam_pending: "Practical Examination",
  practical_exam_completed: "License Card Processing",
  license_card_ready: "License Card Collection",
};

export default function ExaminationCard({
  application,
  selectedStage,
  actionLoading,
  onResult,
  onLicenseReady,
  onLicenseCollected,
}) {
  const [showResultModal, setShowResultModal] =
    useState(false);

  const [selectedResult, setSelectedResult] =
    useState(null);

  const applicationId = application._id;

  const user = application.user || {};

  const fullName =
    application.fullName ||
    user.fullname ||
    "Unknown Candidate";

  const identifier =
    user.identifier ||
    application.user?.identifier ||
    "N/A";

  const category =
    application.licenseCategory || "N/A";

  const isResultLoading =
    actionLoading?.startsWith(
      `${applicationId}-`
    );

  const isActionLoading =
    actionLoading === applicationId;

  const handleResultClick = (result) => {
    setSelectedResult(result);
    setShowResultModal(true);
  };

  const handleConfirmResult = () => {
    onResult(
      applicationId,
      selectedResult
    );

    setShowResultModal(false);
    setSelectedResult(null);
  };

  const renderActions = () => {
    if (
      selectedStage === "biometric_pending" ||
      selectedStage === "written_exam_pending" ||
      selectedStage === "practical_exam_pending"
    ) {
      return (
        <div className="examination-actions">

          <button
            type="button"
            className="fail-button"
            disabled={
              isResultLoading ||
              isActionLoading
            }
            onClick={() =>
              handleResultClick(false)
            }
          >
            {actionLoading ===
            `${applicationId}-false`
              ? "Processing..."
              : "Fail"}
          </button>

          <button
            type="button"
            className="pass-button"
            disabled={
              isResultLoading ||
              isActionLoading
            }
            onClick={() =>
              handleResultClick(true)
            }
          >
            {actionLoading ===
            `${applicationId}-true`
              ? "Processing..."
              : "Pass"}
          </button>

        </div>
      );
    }

    if (
      selectedStage ===
      "practical_exam_completed"
    ) {
      return (
        <div className="examination-actions">
          <button
            type="button"
            className="ready-button"
            disabled={isActionLoading}
            onClick={() =>
              onLicenseReady(applicationId)
            }
          >
            {isActionLoading
              ? "Processing..."
              : "Mark Ready"}
          </button>
        </div>
      );
    }

    if (
      selectedStage ===
      "license_card_ready"
    ) {
      return (
        <div className="examination-actions">
          <button
            type="button"
            className="collected-button"
            disabled={isActionLoading}
            onClick={() =>
              onLicenseCollected(applicationId)
            }
          >
            {isActionLoading
              ? "Processing..."
              : "Mark Collected"}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="examination-card">
      <div className="candidate-header">
        <div className="candidate-avatar">
          {fullName.charAt(0).toUpperCase()}
        </div>

        <div className="candidate-title">
          <h3>{fullName}</h3>
          <p>{identifier}</p>
        </div>
      </div>

      <div className="candidate-details">
        <div className="detail-item">
          <span className="detail-label">
            License Category
          </span>

          <span className="detail-value category-badge" style={{
            backgroundColor: "#E4EDFF",
            color: "#287EFF",
          }}>
            {category}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            Examination Stage
          </span>

          <span className="detail-value">
            {STAGE_LABELS[selectedStage]}
          </span>
        </div>

        {selectedStage ===
          "practical_exam_pending" && (
          <div className="detail-item">
            <span className="detail-label">
              Practical Attempts
            </span>

            <span className="detail-value">
              {application.practicalExam
                ?.attempts || 0}{" "}
              / 3
            </span>
          </div>
        )}
      </div>

      {renderActions()}

      {showResultModal && (
        <ExaminationPassOrFailModal
          application={application}
          result={selectedResult}
          loading={isResultLoading}
          onClose={() => {
            setShowResultModal(false);
            setSelectedResult(null);
          }}
          onConfirm={handleConfirmResult}
        />
      )}
    </div>
  );
}