import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../../shared/hooks/useAxiosPrivate";

import "./EditScheduleModal.css";

export default function EditScheduleModal({
  schedule,
  onClose,
  onSuccess,
}) {
  const axiosPrivate = useAxiosPrivate();

  const [date, setDate] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!schedule) return;

    setDate(
      new Date(schedule.date)
        .toISOString()
        .split("T")[0]
    );

    setStatus(schedule.status);
  }, [schedule]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await axiosPrivate.patch(
        `/schedules/${schedule._id}`,
        {
          date,
          status,
        }
      );

      await onSuccess();

      onClose();
    } catch (err) {
      console.error(
        "Update schedule error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update schedule."
      );
    } finally {
      setLoading(false);
    }
  };

  const getScheduleType = () => {
    if (
      schedule.type === "biometric"
    ) {
      return "Biometric";
    }

    if (
      schedule.type ===
      "written_exam"
    ) {
      return "Written Exam";
    }

    return "Practical Exam";
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-schedule-modal">
        <div className="edit-modal-header">
          <div>
            <h2>
              Edit Schedule
            </h2>

            <p>
              Update schedule information.
            </p>
          </div>

          <button
            className="edit-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="edit-schedule-type">
          <span>
            Schedule Type
          </span>

          <strong>
            {getScheduleType()}
          </strong>
        </div>

        {error && (
          <div className="edit-modal-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >
          <div className="edit-form-group">
            <label>
              Schedule Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />
          </div>

          <div className="edit-form-group">
            <label>
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
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

          <div className="edit-modal-actions">
            <button
              type="button"
              className="edit-secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-primary-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}