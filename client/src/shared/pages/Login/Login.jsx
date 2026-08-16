import React from "react";
import LoginForm from "./LoginForm";
import LoginLogo from "../../../assets/Grow.png";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-hero-container">
          <div className="placeholder-image-box">
            <img src={LoginLogo} alt="Login" />
          </div>
        </div>

        <div className="login-form-wrapper">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}