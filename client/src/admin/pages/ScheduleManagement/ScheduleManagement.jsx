import { useEffect, useMemo, useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";

import ScheduleFilters from "../../components/ScheduleManagement/ScheduleFilters/ScheduleFilters";
import ScheduleList from "../../components/ScheduleManagement/ScheduleList/ScheduleList";
import CreateScheduleModal from "../../components/ScheduleManagement/CreateScheduleModal/CreateScheduleModal";
import EditScheduleModal from "../../components/ScheduleManagement/EditScheduleModal/EditScheduleModal";

import "./ScheduleManagement.css";

export default function ScheduleManagement() {
  const axiosPrivate = useAxiosPrivate();

  const [schedules, setSchedules] = useState([]);

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [editingSchedule, setEditingSchedule] =
    useState(null);

  const [cancellingId, setCancellingId] =
    useState(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosPrivate.get(
        "/schedules/admin"
      );

      setSchedules(
        response.data.schedules || []
      );
    } catch (err) {
      console.error(
        "Failed to fetch schedules:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load schedules."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesType =
        typeFilter === "all" ||
        schedule.type === typeFilter;

      const matchesStatus =
        statusFilter === "all" ||
        schedule.status === statusFilter;

      return (
        matchesType &&
        matchesStatus
      );
    });
  }, [
    schedules,
    typeFilter,
    statusFilter,
  ]);

  const handleCancelSchedule = async (
    scheduleId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this schedule?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(scheduleId);
      setError("");

      await axiosPrivate.patch(
        `/schedules/${scheduleId}/cancel`
      );

      await fetchSchedules();
    } catch (err) {
      console.error(
        "Cancel schedule error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to cancel schedule."
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="schedule-management">

      <div className="schedule-management-header">
        <div>
          <h1>Manage <span style={{
            color: "#0048FF"
          }}>Schedules</span></h1>

          <p>
            Create and manage biometric,
            written examination, and practical
            examination schedules.
          </p>
        </div>
      </div>

      {/* FILTERS */}

      <ScheduleFilters
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
        onCreateSchedule={() => {
          setShowCreateModal(true)
        }}
      />

      {error && (
        <div className="schedule-error">
          {error}
        </div>
      )}

      <ScheduleList
        schedules={filteredSchedules}
        loading={loading}
        onEdit={setEditingSchedule}
        onCancel={handleCancelSchedule}
        cancellingId={cancellingId}
      />

      {showCreateModal && (
        <CreateScheduleModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onSuccess={fetchSchedules}
        />
      )}

      {editingSchedule && (
        <EditScheduleModal
          schedule={editingSchedule}
          onClose={() =>
            setEditingSchedule(null)
          }
          onSuccess={fetchSchedules}
        />
      )}
    </div>
  );
}