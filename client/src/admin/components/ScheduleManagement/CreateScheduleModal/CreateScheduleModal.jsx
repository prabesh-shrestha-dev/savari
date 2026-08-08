import { useState } from "react";
import useAxiosPrivate from "../../../../shared/hooks/useAxiosPrivate";

import "./CreateScheduleModal.css";

export default function CreateScheduleModal({
  onClose,
  onSuccess,
}) {
  const axiosPrivate = useAxiosPrivate();

  const [type, setType] =
    useState("biometric");

  const [date, setDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      setError(
        "Please select a schedule date."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axiosPrivate.post(
        "/schedules",
        {
          type,
          date,
        }
      );

      await onSuccess();

      onClose();
    } catch (err) {
      console.error(
        "Create schedule error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create schedule."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="schedule-modal-overlay"
      style={{
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div className="create-schedule-modal">
        <div className="modal-header">
          <div>
            <h2>
              Create Schedule
            </h2>

            <p>
              Create a new examination schedule.
            </p>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >
          <div className="modal-form-group">
            <label>
              Schedule Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
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

          <div className="modal-form-group">
            <label>
              Schedule Date
            </label>

            <input
              type="date"
              value={date}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(e) =>
                setDate(e.target.value)
              }
            />
          </div>

          <div className="schedule-details">
            {type === "biometric" && (
              <>
                <strong>
                  Biometric Schedule
                </strong>

                <p>
                  One schedule with a
                  maximum capacity of
                  150 candidates.
                </p>
              </>
            )}

            {type === "written_exam" && (
              <>
                <strong>
                  Written Examination
                </strong>

                <p>
                  Three 30-minute slots
                  will automatically
                  be created, with
                  25 candidates per
                  slot.
                </p>
              </>
            )}

            {type === "practical_exam" && (
              <>
                <strong>
                  Practical Examination
                </strong>

                <p>
                  Each license category
                  will have 50 available
                  seats.
                </p>
              </>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="modal-primary-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}