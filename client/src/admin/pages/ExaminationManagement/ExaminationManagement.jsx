import { useCallback, useEffect, useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";

import ExaminationFilters from "../../components/ExaminationManagement/ExaminationFilters/ExaminationFilters";
import ExaminationList from "../../components/ExaminationManagement/ExaminationList/ExaminationList";

import "./ExaminationManagement.css";

const EXAMINATION_STAGES = [
  {
    value: "biometric_pending",
    label: "Biometric Pending",
  },
  {
    value: "written_exam_pending",
    label: "Written Exam Pending",
  },
  {
    value: "practical_exam_pending",
    label: "Practical Exam Pending",
  },
  {
    value: "practical_exam_completed",
    label: "License Card Ready",
  },
  {
    value: "license_card_ready",
    label: "License Card Collection",
  },
];

export default function ExaminationManagement() {
  const axiosPrivate = useAxiosPrivate();

  const [selectedStage, setSelectedStage] = useState(
    "biometric_pending"
  );

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosPrivate.get(
        `/applications/stage/${selectedStage}`
      );

      setApplications(response.data.applications || []);
    } catch (err) {
      console.error(
        "Failed to fetch examination applications:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load examination applications."
      );

      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate, selectedStage]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStageChange = (stage) => {
    setSelectedStage(stage);
  };

  const handleResult = async (applicationId, passed) => {
    try {
      setActionLoading(`${applicationId}-${passed}`);

      let endpoint = "";

      if (selectedStage === "biometric_pending") {
        endpoint = `/examinations/${applicationId}/biometric`;
      }

      if (selectedStage === "written_exam_pending") {
        endpoint = `/examinations/${applicationId}/written`;
      }

      if (selectedStage === "practical_exam_pending") {
        endpoint = `/examinations/${applicationId}/practical`;
      }

      await axiosPrivate.patch(endpoint, {
        passed,
      });

      await fetchApplications();
    } catch (err) {
      console.error("Failed to update examination result:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update examination result."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleLicenseReady = async (applicationId) => {
    try {
      setActionLoading(applicationId);

      await axiosPrivate.patch(
        `/examinations/${applicationId}/license-ready`
      );

      await fetchApplications();
    } catch (err) {
      console.error(
        "Failed to mark license card ready:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to mark license card as ready."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleLicenseCollected = async (applicationId) => {
    try {
      setActionLoading(applicationId);

      await axiosPrivate.patch(
        `/examinations/${applicationId}/license-collected`
      );

      await fetchApplications();
    } catch (err) {
      console.error(
        "Failed to mark license card collected:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to mark license card as collected."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="examination-management">
      <div className="examination-header">
        <div>
          <h1>Manage <span style={{
            color: "#0048FF"
          }}>Examinations</span></h1>
          <p>
            Review examination candidates and update their
            examination results.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchApplications}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <ExaminationFilters
        stages={EXAMINATION_STAGES}
        selectedStage={selectedStage}
        onStageChange={handleStageChange}
      />

      {error && (
        <div className="examination-error">
          {error}
        </div>
      )}

      <ExaminationList
        applications={applications}
        selectedStage={selectedStage}
        loading={loading}
        actionLoading={actionLoading}
        onResult={handleResult}
        onLicenseReady={handleLicenseReady}
        onLicenseCollected={handleLicenseCollected}
      />
    </div>
  );
}