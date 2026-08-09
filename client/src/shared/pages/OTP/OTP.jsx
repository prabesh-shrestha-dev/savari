import { useEffect, useRef, useState } from "react";
import { resendOTP, verifyOTP } from "../../services/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import './OTP.css';

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
    <div className="otp-page-container">
      <div className="otp-card">
          <div className="otp-form-content">
            <div className="otp-header">
              <h1 className="otp-header-title">Verify Account</h1>
              <p className="otp-header-subtitle">
                Enter the 6-digit verification code sent to your email or phone.
              </p>
              <hr className="header-divider" />
            </div>

            {/* OTP Form */}
            <form className="otp-form" onSubmit={handleSubmit}>
              {error && <p className="error-message">{error}</p>}

              <div className="form-group">
                <label htmlFor="otp-input" className="form-label">
                  Verification Code (OTP)
                </label>
                <input
                  id="otp-input"
                  className="form-input otp-input"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  required
                  ref={otpRef}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setOtp(value);
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                style={{
                  backgroundColor: "#287EFF"
                }}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>

              {/* Resend OTP Button */}
              <button
                type="button"
                className="resend-btn"
                disabled={loading}
                onClick={handleResendOTP}
                style={{
                  color: "#287EFF"
                }}
              >
                Resend OTP
              </button>
            </form>

            {/* Back Button */}
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/register")}
            >
              ← Back to Register
            </button>

          </div>

      </div>
    </div>
  );
}