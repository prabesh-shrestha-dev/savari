import React from "react";
import RegisterForm from "./RegisterForm";
import "./Register.css";

export default function Register() {

  return (
    <div className="register-page-container">
      <div className="register-card">
        <div className="register-hero-container">
          <div className="placeholder-image-box">
            <svg viewBox="0 0 100 100">
              {/* <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="2" /> */}
            </svg>
          </div>
        </div>

        <div className="register-form-wrapper">
          <RegisterForm />
        </div>

      </div>
    </div>
  );
}