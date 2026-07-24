import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authApi";
import './RegisterForm.css';

export default function RegisterForm() {
  const navigate = useNavigate();
  const fullnameRef = useRef(null);

  const [fullname, setFullname] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fullnameRef.current?.focus();
  }, []);

  useEffect(() => {
    setError("");
  }, [fullname, identifier, password, confirmPassword])

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        fullname,
        identifier,
        password
      });

      console.log(response.data);

      setFullname("");
      setIdentifier("");
      setPassword("");
      setConfirmPassword("");

      navigate("/verify-otp", {
        state: {
          userId: response.data.userId,
        },
      });

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      console.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-form-content">
      
      {/* Header Titles */}
      <div className="register-header">
        <h1 className="register-header-title">Get Started</h1>
        <p className="register-header-subtitle">Welcome to LMS - Let’s get started</p>
        <hr className="header-divider" />
      </div>

      {/* Registration Form */}
      <form className="register-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullname-input" className="form-label">
            Your Full Name
          </label>
          <input
            id="fullname-input"
            className="form-input fullname-input"
            type="text"
            placeholder="Enter Your Full Name"
            required
            ref={fullnameRef}
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        {/* Email or Phone */}
        <div className="form-group">
          <label htmlFor="identifier-input" className="form-label">
            Email or Phone
          </label>
          <input
            id="identifier-input"
            className="form-input identifier-input"
            type="text"
            placeholder="Enter Your Email or Phone Number"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password-input" className="form-label">
            Password
          </label>
          <input
            id="password-input"
            className="form-input password-input"
            type="password"
            placeholder="Enter Your Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="confirm-password-input" className="form-label">
            Password
          </label>
          <input
            id="confirm-password-input"
            className="form-input confirm-password-input"
            type="password"
            placeholder="Enter Your Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Registering..." : "Create new account"}
        </button>

        {/* Redirect Link */}
        <p className="login-text">
          Already have account?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </form>

    </div>
  )
}