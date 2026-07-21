import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authApi";

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
    <form className="register-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}

      <label htmlFor="fullname-input">
        Full Name
      </label>

      <input 
        id="fullname-input"
        className="fullname-input"
        type="text"
        required
        ref={fullnameRef}
        value={fullname}
        onChange={e => setFullname(e.target.value)}
      />

      <label htmlFor="identifier-input">
        Email or phone
      </label>

      <input 
        id="identifier-input"
        className="identifier-input"
        type="text"
        required
        value={identifier}
        onChange={e => setIdentifier(e.target.value)}
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
        onChange={e => setPassword(e.target.value)}
      />

      <label htmlFor="confirm-password-input">
        Confirm password
      </label>

      <input 
        id="confirm-password-input"
        className="confirm-password-input"
        type="password"
        required
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <Link to="/login">
        <span>Already have an account?</span>
      </Link>
    </form>
  )
}