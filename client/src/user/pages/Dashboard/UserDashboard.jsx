import React, { useState, useEffect, useCallback } from "react";
import {
  Fingerprint,
  QrCode,
  User,
  FileText,
  Check,
  Clock,
  PenLine,
} from "lucide-react";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/contexts/authContext";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");

  const axiosPrivate = useAxiosPrivate();

  const steps = [
    {
      label: "Profile Complete",
      status: "completed",
    },
    {
      label: "Documents Verified",
      status: "completed",
    },
    {
      label: "Biometric Pending",
      status: "active",
    },
    {
      label: "Written Exam Upcoming",
      status: "",
    },
    {
      label: "Practical Exam Upcoming",
      status: "",
    },
    {
      label: "License Issued Upcoming",
      status: "",
    },
  ];


  const activities = [
    {
      title: "Account Created",
      time: "Today, 9:42 AM",
      icon: <User size={15} />,
    },
    {
      title: "Documents Uploaded",
      time: "Today, 9:42 AM",
      icon: <FileText size={15} />,
    },
    {
      title: "Documents successfully verified",
      time: "Today, 9:42 AM",
      icon: <Check size={15} />,
    },
    {
      title: "Application under review",
      time: "Today, 9:42 AM",
      icon: <Clock size={15} />,
    },
    {
      title: "Biometric schedule booked",
      time: "Today, 9:42 AM",
      icon: <Fingerprint size={15} />,
    },
    {
      title: "Written Exam schedule booked",
      time: "Today, 9:42 AM",
      icon: <PenLine size={15} />,
    },
  ];

  const statusCards = [
    {
      title: "Application Status",
      message: "Your application has been submitted.",
      subtext: "Waiting for document review",
    },
    {
      title: "Document Verification",
      message: "Your documents have been approved.",
      subtext: "Document verified successfully",
    },
    {
      title: "Examination Status",
      message: "Your biometric verification is scheduled.",
      subtext: "Upcoming examination",
    },
  ];

  const fetchUserInfo = useCallback(async () => {
    try {

      const response = await axiosPrivate.get(
        `/users/me`
      );

      setUserName(response.data?.user?.fullname || "Prabesh");
    } catch (err) {
      console.error(
        "Failed to fetch user info:",
        err
      );
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  function Greeting() {
    const hour = new Date().getHours();

    const greeting =
      hour < 12 ? "Good morning" :
      hour < 18 ? "Good afternoon" :
      "Good evening";

    return <h1>{greeting}</h1>;
  }


  return (
    <div className="user-dashboard">

      {/* Header */}

      <header className="dashboard-header">

        <div>

          <span className="header-subtitle">
            USER DASHBOARD
          </span>

          <h1>
            {Greeting()}, {" "} 
            <span>
              {userName?.split(" ")[0] || "User"}.
            </span>
          </h1>

          <p>
            Here's the latest on your license application.
          </p>

        </div>


        <button className="primary-btn" onClick={() => {
          navigate("/user/apply")
        }}>
          New Application
        </button>

      </header>



      {/* Action Banner */}

      <div className="action-banner">

        <div className="action-content">

          <div className="action-icon">
            !
          </div>


          <div>

            <h4>
              Action Needed
            </h4>

            <p>
              Your Biometric Has Been Scheduled.
              Please Confirm Your Attendance Before
              09/10/2026
            </p>

          </div>

        </div>


        <button className="action-link" onClick={() => navigate("/user/schedule")}>
          View Details →
        </button>

      </div>




      {/* Status Cards */}

      <div className="status-grid">

        {statusCards.map((card, index) => (

          <div
            className="status-card"
            key={index}
          >

            <div className="status-icon">
              <FileText size={15} />
            </div>


            <h3>
              {card.title}
            </h3>


            <p>
              {card.message}
            </p>


            <span>
              {card.subtext}
            </span>

          </div>

        ))}

      </div>





      <div className="dashboard-layout">


        <div className="dashboard-left">



          {/* Progress Panel */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <span className="panel-label">
                  APPLICATION PROGRESS
                </span>


                <h2>
                  Your licensing journey
                </h2>

              </div>


              <span className="step-badge">
                Step 3 of 6
              </span>

            </div>



            <div className="stepper">

              {steps.map((step, index) => (

                <React.Fragment key={index}>

                  <div
                    className={`step ${step.status}`}
                  >

                    <div className="step-node">
                      {index + 1}
                    </div>


                    <span>
                      {step.label}
                    </span>

                  </div>


                  {index < steps.length - 1 && (
                    index < 2 
                    ? <div className="step-connector blue"></div>
                    : <div className="step-connector not-blue"></div>
                  )}

                </React.Fragment>

              ))}

            </div>



            <div className="panel-footer">

              <span>
                Last updated today at 9:42 AM
              </span>


              <button className="action-link" onClick={() => navigate("/user/schedule")}>
                View Application
              </button>

            </div>


          </div>





          {/* Examination Panel */}

          <div className="dashboard-panel">


            <div className="panel-header">

              <div>

                <span className="panel-label">
                  UP NEXT
                </span>


                <h2>
                  Your Scheduled Examinations
                </h2>

              </div>



              <div className="qr-container">

                <QrCode size={38}/>

                <span>
                  QR Code
                </span>

              </div>


            </div>



            <div className="exam-card">

              <div className="exam-info-group">

                <div className="exam-icon">
                  <Fingerprint size={20} />
                </div>

                <div className="exam-details">
                  <h4>
                    Biometric Verification
                  </h4>

                  <p>
                    Wednesday, August 5, 2026
                  </p>
                </div>

              </div>


              <div className="exam-right">

                <span className="status-tag">
                  Scheduled
                </span>

              </div>

            </div>




            <div className="panel-footer">

              <span>
                Last updated today at 9:42 AM
              </span>


              <button className="action-link" onClick={() => navigate("/user/schedule")}>
                View Schedule
              </button>

            </div>


          </div>


        </div>





        {/* Activity Panel */}

        <div className="dashboard-panel">


          <div className="panel-header">

            <div>

              <span className="panel-label">
                RECENT ACTIVITY
              </span>


              <h2>
                What's happening
              </h2>

            </div>

          </div>




          <div className="activity-list">


            {activities.map((activity, index) => (

              <div
                className="activity-item"
                key={index}
              >

                <div className="activity-icon">

                  {activity.icon}

                </div>


                <div>

                  <h5>
                    {activity.title}
                  </h5>


                  <p>
                    {activity.time}
                  </p>

                </div>


              </div>

            ))}


          </div>


        </div>



      </div>


    </div>
  );
}