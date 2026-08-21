import "./AuthLoader.css";
export default function AuthLoader() {
  return (
    <div className="auth-loader">

      <div className="floating-dot dot1"></div>
      <div className="floating-dot dot2"></div>
      <div className="floating-dot dot3"></div>


      <div className="road">
        <div className="road-line"></div>
      </div>


      <div className="auth-car">

        <div className="car-body"></div>

        <div className="car-top"></div>

        <div className="window one"></div>
        <div className="window two"></div>

        <div className="headlight"></div>

        <div className="wheel left"></div>
        <div className="wheel right"></div>

      </div>



      <div className="loader-content">

        <div className="journey-badge">
          <span>🚗</span>
          Starting Savari
        </div>

        <h3>
          Preparing your journey...
        </h3>

        <p>
          Checking secure connection
        </p>


        <div className="loading-steps">

          <span className="active">
            ✓ Authentication
          </span>

          <span>
            ○ Loading dashboard
          </span>

          <span>
            ○ Securing session
          </span>

        </div>


        <div className="loader-progress">
          <div></div>
        </div>


      </div>


    </div>
  );
}