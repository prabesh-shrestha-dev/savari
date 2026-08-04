import { useState } from "react";

import WrittenExamSlotSelector from "../WrittenExamSlotSelector/WrittenExamSlotSelector";

import "./ScheduleCard.css";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};

export default function ScheduleCard({
  schedule,
  type,
  onBook,
  bookingLoading,
}) {
  const [selectedSlot, setSelectedSlot] =
    useState(null);

  const [showSlots, setShowSlots] =
    useState(false);

  const handleBook = () => {
    if (type === "written_exam") {
      if (!selectedSlot) {
        setShowSlots(true);
        return;
      }

      onBook(
        schedule._id,
        selectedSlot
      );

      return;
    }

    onBook(schedule._id);
  };

  return (
    <div className="schedule-card">

      <div className="schedule-card-date">
        <span>
          {formatDate(schedule.date)}
        </span>
      </div>

      {type === "biometric" && (
        <div className="capacity-info">
          <span>Available Seats</span>

          <strong>
            {schedule.biometricCapacity.capacity -
              schedule.biometricCapacity.booked}
          </strong>
        </div>
      )}

      {type === "practical_exam" && (
        <div className="capacity-info">
          <span>
            Category{" "}
            {Object.keys(
              schedule.practicalCapacity || {}
            ).join(", ")}
          </span>

          <strong>Available</strong>
        </div>
      )}

      {type === "written_exam" && (
        <WrittenExamSlotSelector
          slots={schedule.slots}
          selectedSlot={selectedSlot}
          onSelect={setSelectedSlot}
          visible={showSlots}
        />
      )}

      <button
        type="button"
        className="book-schedule-button"
        onClick={handleBook}
        disabled={bookingLoading}
      >
        {bookingLoading
          ? "Booking..."
          : type === "written_exam" &&
            !selectedSlot
          ? "Select Time Slot"
          : "Book Schedule"}
      </button>

    </div>
  );
}