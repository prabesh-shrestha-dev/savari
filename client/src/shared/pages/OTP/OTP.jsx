import { useEffect, useRef, useState } from "react";
import { resendOTP, verifyOTP } from "../../services/authApi";
import { useLocation, useNavigate } from "react-router-dom";

export default function OTP() {
  const otpRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Passed from Register page
  const { userId } = location.state || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    otpRef.current?.focus();

    if (!userId) {
      navigate("/register", { replace: true });
    }
  }, [userId, navigate]);

  useEffect(() => {
    setError("");
  }, [otp]);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyOTP({
        userId,
        otp,
      });

      console.log(response.data);

      navigate("/login", {
        replace: true,
      });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOTP() {
    try {
      setLoading(true);
      setError("");

      const response = await resendOTP({
        userId,
      });

      console.log(response.data);

      alert("A new OTP has been sent.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="otp-form" onSubmit={handleSubmit}>
      <h1>Verify Account</h1>

      <p>
        Enter the 6-digit verification code sent to your email or phone.
      </p>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <label htmlFor="otp-input">
        OTP
      </label>

      <input
        id="otp-input"
        className="otp-input"
        type="text"
        maxLength={6}
        required
        ref={otpRef}
        value={otp}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          setOtp(value);
        }}
      />

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={handleResendOTP}
      >
        Resend OTP
      </button>
    </form>
  );
}