import React, { useState, useEffect } from "react";
import "./WelcomeModal.css";

export default function WelcomeModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the welcome popup
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for exit animation to complete before unmounting/hiding
    setTimeout(() => {
      localStorage.setItem("hasSeenWelcome", "true");
      setIsVisible(false);
      setIsClosing(false);
    }, 350);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`welcome-overlay ${isClosing ? "closing" : ""}`}>
      <section
        className="welcome-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcomeTitle"
      >
        {/* Light Driving Loader */}
        <div className="fullscreen-loader">
          <div className="driving-loader-stage">
            <div className="speed-lines">
              <div className="speed-line l1" />
              <div className="speed-line l2" />
              <div className="speed-line l3" />
            </div>
            <svg
              className="loader-car"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <div className="loader-road" />
          </div>
        </div>

        <button
          className="close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Hero Section */}
        <div className="heros">
          <div className="sun" />
          <div className="cloud one" />
          <div className="cloud two" />

          <div className="float-card license-card">
            <div className="card-head">
              <span className="mini-icon">▣</span>
              Driving Licence
              <span className="check">✓</span>
            </div>
            <div className="card-line" />
            <div className="card-line short" />
          </div>

          <div className="float-card exam-card">
            <div className="card-head">
              <span className="mini-icon">◷</span>
              Exam Scheduled
            </div>
            <div className="card-line" />
            <div className="card-line short" />
          </div>

          <div className="float-card payment-card">
            <div className="card-head">
              <span className="mini-icon">₹</span>
              Payment
              <span className="check">✓</span>
            </div>
            <div className="card-line" />
            <div className="card-line short" />
          </div>

          <div className="pin" />
          <div className="road" />

          <div className="car">
            <div className="shadow" />
            <div className="car-top">
              <div className="window a" />
              <div className="window b" />
            </div>
            <div className="car-body">
              <div className="headlight" />
              <div className="tail" />
            </div>
            <div className="wheel a" />
            <div className="wheel b" />
          </div>
        </div>

        {/* Content Section */}
        <div className="brand">
          <div className="logo">
            <img src="/090.png" alt="S"/>
          </div>
          <div>
            <div className="brand-name">Savari</div>
            <div className="brand-subtitle">Licence Management System</div>
          </div>
        </div>

        <h1 className="welcome-title" id="welcomeTitle">
          Welcome to your Dashboard 👋
        </h1>

        <p className="welcome-description">
          You are all set! From here, you can track your application status,
          schedule exam slots, upload required documents, and complete online
          payments seamlessly.
        </p>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">✓</span>
            Apply & upload documents
          </div>
          <div className="feature">
            <span className="feature-icon">◷</span>
            Schedule examinations
          </div>
          <div className="feature">
            <span className="feature-icon">₹</span>
            Make online payments
          </div>
          <div className="feature">
            <span className="feature-icon">↗</span>
            Track application live
          </div>
        </div>

        <div className="actions">
          <button className="primary-btn" onClick={handleClose}>
            Explore Dashboard →
          </button>
        </div>

        <div className="tagline">
          Everything you need. One digital window.
        </div>
      </section>
    </div>
  );
}
