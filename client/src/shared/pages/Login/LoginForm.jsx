import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, resendOTP } from "../../services/authApi";
import { useAuth } from "../../contexts/authContext";
import "./LoginForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const identifierRef = useRef(null);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  useEffect(() => {
    setError("");
  }, [identifier, password]);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await login({
        identifier,
        password,
      });

      const { accessToken, user } = response.data;

      setAuth({
        accessToken,
        user,
      });

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "user") {
        navigate("/user/dashboard", { replace: true });
      }

    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 403) {
        const userId = err.response?.data?.userId;

        if (!userId) {
          setError("Unable to verify your account.");
          return;
        }

        try {
          await resendOTP({ userId });

          navigate("/verify-otp", {
            replace: true,
            state: {
              userId,
            },
          });

        } catch (resendErr) {
          setError(
            resendErr.response?.data?.message ||
            "Failed to resend OTP."
          );
        }

        return;
      }

      setError(message || "Login failed.");

      console.error(
        err.response?.data || err.message
      );

    } finally {
      setLoading(false);
    }
  }

  return (
   <div className="login-form-content">

      <div className="login-header">
        <h1 className="login-header-title">Login</h1>
        <p className="login-header-subtitle">Welcome to Savari - Login</p>
        <hr className="header-divider" />
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="identifier-input" className="form-label">
            Your Email or Phone no
          </label>
          <input
            id="identifier-input"
            placeholder="hello@gmail.com"
            className="form-input identifier-input"
            type="text"
            required
            ref={identifierRef}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password-input" className="form-label">
            Password
          </label>
          <input
            id="password-input"
            placeholder="••••••••••••"
            className="form-input password-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/register" className="signup-link">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}