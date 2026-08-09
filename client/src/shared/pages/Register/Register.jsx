import React from "react";
import RegisterForm from "./RegisterForm";
import RegisterVideo from "../../../assets/Grow.mp4";
import "./Register.css";

export default function Register() {

  return (
    <div className="register-page-container">
      <div className="register-card">
        <div className="register-hero-container">
          <div className="placeholder-image-box">
            <video 
              src={RegisterVideo} 
              autoPlay
              muted
              loop
              playsInline
              style={{
                borderRadius: "20px"
              }}
            />
          </div>
        </div>

        <div className="register-form-wrapper">
          <RegisterForm />
        </div>

      </div>
    </div>
  );
}