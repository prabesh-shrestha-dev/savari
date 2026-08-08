import "./QRModal.css";
import QRCode from "react-qr-code";

export default function QRModal({
  schedule,
  onClose,
}) {
  return (
    <div
      className="qr-modal-overlay"
      onClick={onClose}
    >
      <div
        className="qr-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Entry QR Code</h2>

        <p>
          Present this QR code when arriving for your
          examination.
        </p>

        <div className="qr-wrapper">
          <QRCode
            value={JSON.stringify({
              applicationId: "APP-2026-001245",
              examination: schedule.type,
              date: schedule.date,
              issuedBy: "Prabesh Shrestha",
            }, null, 2)}
            size={180}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
          />
        </div>

        <div className="qr-info">
          <p>
            <strong>Examination</strong>
          </p>

          <p>{schedule.type}</p>

          <p>
            {new Date(
              schedule.date
            ).toLocaleDateString()}
          </p>

          {schedule.slot && (
            <p>
              {schedule.slot.startTime} -{" "}
              {schedule.slot.endTime}
            </p>
          )}
        </div>

        <button
          className="close-btn"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}