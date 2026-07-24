import React from "react";
import LoginForm from "./LoginForm";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-hero-container">
          <div className="placeholder-image-box">
            {/* <svg viewBox="0 0 100 100">
              <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="2" />
            </svg> */}
          </div>
        </div>

        <div className="login-form-wrapper">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}