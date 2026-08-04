import "./WrittenExamSlotSelector.css";

export default function WrittenExamSlotSelector({
  slots,
  selectedSlot,
  onSelect,
  visible,
}) {
  if (!visible) {
    return null;
  }

  return (
    <div className="slot-selector">
      <p>Select examination time</p>

      <div className="slot-list">
        {slots.map((slot) => {
          const available =
            slot.booked < slot.capacity;

          return (
            <button
              key={slot._id}
              type="button"
              disabled={!available}
              className={`slot-button ${
                selectedSlot === slot._id
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                onSelect(slot._id)
              }
            >
              <span>
                {slot.startTime} -{" "}
                {slot.endTime}
              </span>

              <small>
                {available
                  ? `${slot.capacity - slot.booked} seats`
                  : "Full"}
              </small>
            </button>
          );
        })}
      </div>
    </div>
  );
}