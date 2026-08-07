import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../../shared/hooks/useAxiosPrivate";

import ScheduleTypeTabs from "../ScheduleTypeTabs/ScheduleTypeTabs";
import AvailableScheduleList from "../AvailableScheduleList/AvailableScheduleList";

import "./ScheduleBookingSection.css";


const getAvailableType = (
  application,
  mySchedules
) => {
  if (
    [
      "application_approved",
      "biometric_failed",
    ].includes(application.currentStep) &&
    !mySchedules?.biometric?.schedule
  ) {
    return "biometric";
  }

  if (
    application.currentStep ===
      "biometric_completed" &&
    !mySchedules?.writtenExam?.schedule
  ) {
    return "written_exam";
  }

  if (
    [
      "written_exam_completed",
      "practical_exam_failed",
    ].includes(application.currentStep) &&
    application.practicalExam.attempts < 3 &&
    !mySchedules?.practicalExam?.schedule
  ) {
    return "practical_exam";
  }

  return "";
};


export default function ScheduleBookingSection({
  application,
  mySchedules,
  onBookingSuccess,
  bookingLoading,
}) {
  const axiosPrivate = useAxiosPrivate();

  const [selectedType, setSelectedType] =
    useState("");

  const [schedules, setSchedules] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleTypeChange = async (type) => {
    setSelectedType(type);
    setSchedules([]);
    setError("");

    try {
      setLoading(true);

      const response =
        await axiosPrivate.get(
          `/schedules/available?type=${type}`
        );

      setSchedules(
        response.data.schedules || []
      );

    } catch (err) {
      console.error(
        "Failed to fetch available schedules:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load available schedules."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!application) return;

    const type = getAvailableType(
      application,
      mySchedules
    );

    if (type) {
      handleTypeChange(type);
    } else {
      setSelectedType("");
      setSchedules([]);
    }

  }, [
    application,
    mySchedules,
  ]);


  const handleBooking = async (
    scheduleId,
    slotId = null
  ) => {

    try {

      const body = slotId
        ? { slotId }
        : {};

      const response =
        await axiosPrivate.post(
          `/schedules/${scheduleId}/book`,
          body
        );


      await onBookingSuccess(
        response.data.message
      );


      setSchedules([]);


    } catch (err) {

      console.error(
        "Booking failed:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Failed to book schedule."
      );
    }
  };


  const alreadyBooked =
    selectedType === "biometric"
      ? mySchedules?.biometric?.schedule
      : selectedType === "written_exam"
      ? mySchedules?.writtenExam?.schedule
      : selectedType === "practical_exam"
      ? mySchedules?.practicalExam?.schedule
      : false;


  return (
    <section className="booking-section">

      <div className="booking-section-header">

        <h2>
          Book Examination Schedule
        </h2>

        <p>
          Select the examination you are
          eligible to schedule.
        </p>

      </div>


      <ScheduleTypeTabs
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        application={application}
        mySchedules={mySchedules}
      />


      {/* {error && (
        <div className="booking-error">
          {error}
        </div>
      )} */}


      <AvailableScheduleList
        schedules={schedules}
        type={selectedType}
        loading={loading}
        onBook={handleBooking}
        bookingLoading={bookingLoading}
        alreadyBooked={alreadyBooked}
      />


    </section>
  );
}