import { useState } from "react";
import "./PaymentModal.css";

export default function PaymentModal({
  amount,
  title,
  description,
  onClose,
  onPaymentSuccess,
}) {
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    try {
      setIsPaying(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const paymentData = {
        transactionId: `DEMO-${Date.now()}`,
        status: "completed",
      };

      onPaymentSuccess(paymentData);

    } catch (error) {
      console.error("Payment failed: ", error);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <button
          type="button"
          className="payment-close"
          onClick={onClose}
          disabled={isPaying}
        >
          ×
        </button>

        <div className="payment-header">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="payment-amount">
          <span>Amount to pay</span>
          <strong>Rs. {amount}</strong>
        </div>

        <div className="demo-payment-notice">
          <p>Demo Payment</p>
          <span>
            This is a simulated payment for demonstration purposes.
          </span>
        </div>

        <div className="payment-actions">
          <button
            type="button"
            className="payment-cancel-btn"
            onClick={onClose}
            disabled={isPaying}
          >
            Cancel
          </button>

          <button
            type="button"
            className="payment-pay-btn"
            onClick={handlePayment}
            disabled={isPaying}
          >
            {isPaying ? "Processing..." : `Pay Rs. ${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
}