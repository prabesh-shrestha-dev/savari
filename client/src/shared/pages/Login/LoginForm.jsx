import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, resendOTP } from "../../services/authApi";
import { useAuth } from "../../contexts/authContext";

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
    <form className="login-form" onSubmit={handleSubmit}>
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <label htmlFor="identifier-input">
        Email or phone
      </label>

      <input
        id="identifier-input"
        className="identifier-input"
        type="text"
        required
        ref={identifierRef}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      <label htmlFor="password-input">
        Password
      </label>

      <input
        id="password-input"
        className="password-input"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <Link to="/register">
        <span>Need an account?</span>
      </Link>
    </form>
  );
}