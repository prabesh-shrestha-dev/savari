import { useCallback, useEffect, useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";

import ScheduleHeader from "../../components/Schedule/ScheduleHeader/ScheduleHeader";
import ApplicationProgress from "../../components/Schedule/ApplicationProgress/ApplicationProgress";
import CurrentScheduleCard from "../../components/Schedule/CurrentScheduleCard/CurrentScheduleCard";
import ScheduleBookingSection from "../../components/Schedule/ScheduleBookingSection/ScheduleBookingSection";

import "./Schedule.css";

export default function Schedule() {
  const axiosPrivate = useAxiosPrivate();

  const [application, setApplication] = useState(null);
  const [mySchedules, setMySchedules] = useState(null);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchApplication = useCallback(async () => {
    const response = await axiosPrivate.get("/applications/me");

    return response.data.application;
  }, [axiosPrivate]);

  const fetchMySchedules = useCallback(async () => {
    const response = await axiosPrivate.get("/schedules/my");

    return response.data.schedules;
  }, [axiosPrivate]);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [applicationData, schedulesData] =
        await Promise.all([
          fetchApplication(),
          fetchMySchedules(),
        ]);

      setApplication(applicationData);
      setMySchedules(schedulesData);

    } catch (err) {
      console.error("Failed to load schedule page:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your schedule information."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchApplication, fetchMySchedules]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleBookingSuccess = async (message) => {
    try {
      setBookingLoading(true);

      setSuccessMessage(message || "Schedule booked successfully.");
      setError("");

      const [applicationData, schedulesData] =
        await Promise.all([
          fetchApplication(),
          fetchMySchedules(),
        ]);

      setApplication(applicationData);
      setMySchedules(schedulesData);

    } catch (err) {
      console.error("Failed to refresh schedule:", err);

      setError(
        err.response?.data?.message ||
          "Schedule booked, but failed to refresh the page."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="schedule-page">
        <div className="schedule-loading">
          <div className="loading-spinner"></div>
          <p>Loading your examination schedule...</p>
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="schedule-page">
        <div className="schedule-error-card">
          <h2>Unable to Load Schedule</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={loadPage}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-page">

      <div className="schedule-card">
        <ScheduleHeader />

        {error && (
          <div className="schedule-alert error">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="schedule-alert success">
            {successMessage}
          </div>
        )}

        {application && (
          <ApplicationProgress
            application={application}
          />
        )}

        {mySchedules && (
          <CurrentScheduleCard
            schedules={mySchedules}
            application={application}
          />
        )}

        {application && (
          <ScheduleBookingSection
            application={application}
            mySchedules={mySchedules}
            onBookingSuccess={handleBookingSuccess}
            bookingLoading={bookingLoading}
          />
        )}
      </div>

    </div>
  );
}