import React, { useState, useEffect, useCallback } from "react";
import {
  Fingerprint,
  QrCode,
  User,
  FileUser,
  FileText,
  Check,
  Clock,
  PenLine,
  BookOpenCheck
} from "lucide-react";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";

export default function UserDashboard() {
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();

  const [userName, setUserName] = useState("");
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [schedules, setSchedules] = useState(null);

  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Greeting
  |--------------------------------------------------------------------------
  */

  function Greeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
  }

  /*
  |--------------------------------------------------------------------------
  | Fetch Dashboard Data
  |--------------------------------------------------------------------------
  */

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        userResponse,
        documentsResponse,
        applicationResponse,
        schedulesResponse,
      ] = await Promise.allSettled([
        axiosPrivate.get("/users/me"),
        axiosPrivate.get("/documents/me"),
        axiosPrivate.get("/applications/me"),
        axiosPrivate.get("/schedules/my"),
      ]);

      /*
      |--------------------------------------------------------------------------
      | User
      |--------------------------------------------------------------------------
      */

      if (userResponse.status === "fulfilled") {
        setUserName(
          userResponse.value.data?.user?.fullname || "User"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Documents
      |--------------------------------------------------------------------------
      */

      if (documentsResponse.status === "fulfilled") {
        setDocuments(
          documentsResponse.value.data?.documents || null
        );
      } else {
        setDocuments(null);
      }

      /*
      |--------------------------------------------------------------------------
      | Application
      |--------------------------------------------------------------------------
      */

      if (applicationResponse.status === "fulfilled") {
        setApplication(
          applicationResponse.value.data?.application || null
        );
      } else {
        setApplication(null);
      }

      /*
      |--------------------------------------------------------------------------
      | Schedules
      |--------------------------------------------------------------------------
      */

      if (schedulesResponse.status === "fulfilled") {
        setSchedules(
          schedulesResponse.value.data?.schedules || null
        );
      } else {
        setSchedules(null);
      }

    } catch (err) {
      console.error(
        "Failed to fetch dashboard data:",
        err
      );
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /*
  |--------------------------------------------------------------------------
  | Document Status
  |--------------------------------------------------------------------------
  */

  const documentsApproved =
    documents?.identityCard?.status === "approved" &&
    documents?.passportSizePhoto?.status === "approved" &&
    documents?.bloodGroupReport?.status === "approved";

  /*
  |--------------------------------------------------------------------------
  | Application Step
  |--------------------------------------------------------------------------
  */

  const getCurrentStep = () => {
    /*
     * Step 1 = Profile
     *
     * Registration automatically completes the profile.
     */

    if (!application) {
      /*
       * Documents are not approved yet
       */
      if (!documentsApproved) {
        return 1;
      }

      /*
       * Documents approved, waiting for application
       */
      return 2;
    }

    const currentStep = application.currentStep;

    /*
     * Application is waiting for admin review.
     *
     * Documents are already approved because
     * the application could not have been created otherwise.
     */
    if (currentStep === "application_pending") {
      return 2;
    }

    /*
     * Application approved / biometric stage
     */
    if (
      currentStep === "application_approved" ||
      currentStep === "biometric_pending" ||
      currentStep === "biometric_failed"
    ) {
      return 3;
    }

    /*
     * Biometric completed / written exam stage
     */
    if (
      currentStep === "biometric_completed" ||
      currentStep === "written_exam_pending" ||
      currentStep === "written_exam_failed"
    ) {
      return 4;
    }

    /*
     * Written completed / practical exam stage
     */
    if (
      currentStep === "written_exam_completed" ||
      currentStep === "practical_exam_pending" ||
      currentStep === "practical_exam_failed"
    ) {
      return 5;
    }

    /*
     * License card stage
     */
    if (
      currentStep === "practical_exam_completed" ||
      currentStep === "license_card_ready" ||
      currentStep === "license_card_collected"
    ) {
      return 6;
    }

    return 1;
  };

  const currentStepNumber = getCurrentStep();

  /*
  |--------------------------------------------------------------------------
  | Steps
  |--------------------------------------------------------------------------
  */

  const steps = [
    {
      label: "Profile Complete",
      status:
        currentStepNumber > 1
          ? "completed"
          : "active",
    },
    {
      label: "Documents Verified",
      status:
        currentStepNumber > 2
          ? "completed"
          : currentStepNumber === 2
          ? "active"
          : "",
    },
    {
      label: "Biometric",
      status:
        currentStepNumber > 3
          ? "completed"
          : currentStepNumber === 3
          ? "active"
          : "",
    },
    {
      label: "Written Exam",
      status:
        currentStepNumber > 4
          ? "completed"
          : currentStepNumber === 4
          ? "active"
          : "",
    },
    {
      label: "Practical Exam",
      status:
        currentStepNumber > 5
          ? "completed"
          : currentStepNumber === 5
          ? "active"
          : "",
    },
    {
      label: "License Card",
      status:
        currentStepNumber > 6
          ? "completed"
          : currentStepNumber === 6
          ? "active"
          : "",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Application Status Text
  |--------------------------------------------------------------------------
  */

  const getApplicationStatus = () => {
    if (!application) {
      if (documentsApproved) {
        return {
          message: "Your documents have been approved.",
          subtext: "You are eligible to submit an application.",
        };
      }

      return {
        message: "Complete your document verification.",
        subtext: "Upload and verify all required documents.",
      };
    }

    switch (application.currentStep) {
      case "application_pending":
        return {
          message: "Your application is under review.",
          subtext: "Waiting for application approval.",
        };

      case "application_rejected":
        return {
          message: "Your application was rejected.",
          subtext:
            application.rejection?.reason ||
            "Please review the rejection details.",
        };

      case "application_approved":
        return {
          message: "Your application has been approved.",
          subtext: "You can now schedule your biometric.",
        };

      default:
        return {
          message: "Your application is progressing.",
          subtext: "Continue following your application status.",
        };
    }
  };

  const applicationStatus = getApplicationStatus();

  /*
  |--------------------------------------------------------------------------
  | Document Status
  |--------------------------------------------------------------------------
  */

  const getDocumentStatus = () => {
    if (!documents) {
      return {
        message: "Documents have not been uploaded.",
        subtext: "Upload all required documents.",
      };
    }

    if (documentsApproved) {
      return {
        message: "Your documents have been approved.",
        subtext: "Document verification completed.",
      };
    }

    const allUploaded =
      documents.identityCard?.url &&
      documents.passportSizePhoto?.url &&
      documents.bloodGroupReport?.url;

    if (!allUploaded) {
      return {
        message: "Some documents are missing.",
        subtext: "Upload all required documents.",
      };
    }

    const hasRejected =
      documents.identityCard?.status === "rejected" ||
      documents.passportSizePhoto?.status === "rejected" ||
      documents.bloodGroupReport?.status === "rejected";

    if (hasRejected) {
      return {
        message: "Some documents were rejected.",
        subtext: "Please upload the rejected documents again.",
      };
    }

    return {
      message: "Your documents are being reviewed.",
      subtext: "Waiting for document verification.",
    };
  };

  const documentStatus = getDocumentStatus();

  /*
  |--------------------------------------------------------------------------
  | Examination Status
  |--------------------------------------------------------------------------
  */

  const getExaminationStatus = () => {
    if (!application) {
      return {
        message: "No application submitted.",
        subtext: "Submit an application to continue.",
      };
    }

    switch (application.currentStep) {
      case "application_approved":
        return {
          message: "Biometric scheduling is available.",
          subtext: "Choose a biometric examination date.",
        };

      case "biometric_pending":
        return {
          message: "Your biometric is scheduled.",
          subtext: "Please attend your scheduled biometric.",
        };

      case "biometric_failed":
        return {
          message: "Biometric needs to be rescheduled.",
          subtext: "Please book another biometric date.",
        };

      case "biometric_completed":
        return {
          message: "Written exam scheduling is available.",
          subtext: "Choose a written examination date.",
        };

      case "written_exam_pending":
        return {
          message: "Your written exam is scheduled.",
          subtext: "Please attend your scheduled exam.",
        };

      case "written_exam_failed":
        return {
          message: "Written exam needs to be rescheduled.",
          subtext: "Please book another written exam.",
        };

      case "written_exam_completed":
        return {
          message: "Practical exam scheduling is available.",
          subtext: "Choose a practical examination date.",
        };

      case "practical_exam_pending":
        return {
          message: "Your practical exam is scheduled.",
          subtext: "Please attend your scheduled exam.",
        };

      case "practical_exam_failed":
        return {
          message: "Practical exam can be rescheduled.",
          subtext: "You may use another practical attempt.",
        };

      case "practical_exam_completed":
        return {
          message: "Practical examination completed.",
          subtext: "Waiting for license card processing.",
        };

      case "license_card_ready":
        return {
          message: "Your license card is ready.",
          subtext: "You can collect your license card.",
        };

      case "license_card_collected":
        return {
          message: "Your license has been collected.",
          subtext: "Licensing process completed.",
        };

      default:
        return {
          message: "No examination scheduled.",
          subtext: "Your examination status will appear here.",
        };
    }
  };

  const examinationStatus = getExaminationStatus();

  /*
  |--------------------------------------------------------------------------
  | Schedule Helpers
  |--------------------------------------------------------------------------
  */

  const biometricSchedule =
    schedules?.biometric?.schedule || null;

  const writtenSchedule =
    schedules?.writtenExam?.schedule || null;

  const practicalSchedule =
    schedules?.practicalExam?.schedule || null;

  const writtenSlot =
    writtenSchedule?.slots?.find(
      (slot) =>
        slot._id ===
        schedules?.writtenExam?.slot
    ) || null;

  /*
  |--------------------------------------------------------------------------
  | Find Upcoming / Current Schedule
  |--------------------------------------------------------------------------
  */

  let examSchedule = null;

  if (biometricSchedule) {
    examSchedule = {
      type: "biometric",
      schedule: biometricSchedule,
      slot: null,
      title: "Biometric Verification",
      icon: <Fingerprint size={20} />,
    };
  } else if (writtenSchedule) {
    examSchedule = {
      type: "written_exam",
      schedule: writtenSchedule,
      slot: writtenSlot,
      title: "Written Examination",
      icon: <PenLine size={20} />,
    };
  } else if (practicalSchedule) {
    examSchedule = {
      type: "practical_exam",
      schedule: practicalSchedule,
      slot: null,
      title: "Practical Examination",
      icon: <FileUser size={20} />,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Date Formatting
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Schedule Time
  |--------------------------------------------------------------------------
  */

  const getExamTime = () => {
    if (!examSchedule?.slot) {
      return "";
    }

    return `${examSchedule.slot.startTime} - ${examSchedule.slot.endTime}`;
  };

  /*
  |--------------------------------------------------------------------------
  | Action Banner
  |--------------------------------------------------------------------------
  */

  const getActionBanner = () => {
    if (!application) {
      if (!documentsApproved) {
        return {
          title: "Action Needed",
          message:
            "Please complete your document verification before submitting an application.",
          nav: 2,
        };
      }

      return {
        title: "Action Needed",
        message:
          "Your documents are approved. You can now submit your license application.",
        nav: 3,
      };
    }

    if (
      application.currentStep ===
        "application_approved" ||
      application.currentStep ===
        "biometric_failed"
    ) {
      return {
        title: "Action Needed",
        message:
          "Your biometric examination is ready to be scheduled.",
        nav: 4,
      };
    }

    if (
      application.currentStep ===
      "biometric_completed"
    ) {
      return {
        title: "Action Needed",
        message:
          "Your written examination is ready to be scheduled.",
        nav: 4,
      };
    }

    if (
      application.currentStep ===
      "written_exam_completed"
    ) {
      return {
        title: "Action Needed",
        message:
          "Your practical examination is ready to be scheduled.",
        nav: 4,
      };
    }

    if (
      application.currentStep ===
      "license_card_ready"
    ) {
      return {
        title: "Action Needed",
        message:
          "Your license card is ready for collection.",
        nav: 6,
      };
    }

    if (examSchedule) {
      return {
        title: "Upcoming Examination",
        message:
          `Your ${examSchedule.title.toLowerCase()} is scheduled.`,
        nav: 4,
      };
    }

    return {
      title: "Application Progress",
      message:
        "Your licensing application is progressing normally.",
      nav: 4,
    };
  };

  const actionBanner = getActionBanner();

  /*
  |--------------------------------------------------------------------------
  | Activities
  |--------------------------------------------------------------------------
  |
  | These are generated from actual application/schedule data.
  |
  */

const activities = [
  {
    title: "Account Created",
    time: "August 1, 2026",
    icon: <User size={15} />,
  },
  {
    title: "Documents Uploaded",
    time: "August 2, 2026",
    icon: <FileUser size={15} />,
  },
  {
    title: "Documents Successfully Verified",
    time: "August 3, 2026",
    icon: <Check size={15} />,
  },
  {
    title: "Application Submitted",
    time: "August 4, 2026",
    icon: <FileUser size={15} />,
  },
  {
    title: "Application Approved",
    time: "August 5, 2026",
    icon: <Check size={15} />,
  },
  {
    title: "Biometric Schedule Booked",
    time: "August 6, 2026",
    icon: <Fingerprint size={15} />,
  },
  {
    title: "Written Exam Schedule Booked",
    time: "August 10, 2026",
    icon: <PenLine size={15} />,
  },
];

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="user-dashboard">
        <header className="dashboard-header">
          <div>
            <span className="header-subtitle">
              USER DASHBOARD
            </span>

            <h1>
              Loading...
            </h1>

            <p>
              Loading your license application information.
            </p>
          </div>
        </header>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */

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

        <button
          className="primary-btn"
          onClick={() => {
            navigate("/user/apply");
          }}
        >
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
              {actionBanner.title}
            </h4>

            <p>
              {actionBanner.message}
            </p>

          </div>

        </div>

        <button
          className="action-link"
          onClick={() => {
            if (actionBanner.nav === 2) {
              navigate("/user/documents");
            } else if (actionBanner.nav === 3) {
              navigate("/user/apply");
            } else if (actionBanner.nav === 4) {
              navigate("/user/schedule");
            } else if (actionBanner.nav === 6) {
              navigate("/user/license");
            }
          }}
        >
          View Details →
        </button>

      </div>


      {/* Status Cards */}

      <div className="status-grid">

        <div className="status-card">

          <div className="status-icon">
            <FileUser size={15} />
          </div>

          <h3>
            Application Status
          </h3>

          <p>
            {applicationStatus.message}
          </p>

          <span>
            {applicationStatus.subtext}
          </span>

        </div>


        <div className="status-card">

          <div className="status-icon">
            <FileText size={15} />
          </div>

          <h3>
            Document Verification
          </h3>

          <p>
            {documentStatus.message}
          </p>

          <span>
            {documentStatus.subtext}
          </span>

        </div>


        <div className="status-card">

          <div className="status-icon">
            <BookOpenCheck size={15} />
          </div>

          <h3>
            Examination Status
          </h3>

          <p>
            {examinationStatus.message}
          </p>

          <span>
            {examinationStatus.subtext}
          </span>

        </div>

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
                Step {currentStepNumber} of 6
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
                    <div
                      className={`step-connector ${
                        index + 1 < currentStepNumber
                          ? "blue"
                          : "not-blue"
                      }`}
                    ></div>
                  )}

                </React.Fragment>

              ))}

            </div>


            <div className="panel-footer">

              <span>
                {application?.updatedAt
                  ? `Last updated ${formatDate(
                      application.updatedAt
                    )}`
                  : documents?.updatedAt
                  ? `Last updated ${formatDate(
                      documents.updatedAt
                    )}`
                  : "Complete your profile to begin"}
              </span>

              <button
                className="action-link"
                onClick={() =>
                  navigate("/user/schedule")
                }
              >
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

              {examSchedule ? (
                <>
                  <div className="exam-info-group">

                    <div className="exam-icon">
                      {examSchedule.icon}
                    </div>

                    <div className="exam-details">

                      <h4>
                        {examSchedule.title}
                      </h4>

                      <p>
                        {formatDate(
                          examSchedule.schedule.date
                        )}
                        {getExamTime() &&
                          ` • ${getExamTime()}`}
                      </p>

                    </div>

                  </div>

                  <div className="exam-right">

                    <span className="status-tag">
                      Scheduled
                    </span>

                  </div>
                </>
              ) : (
                <div className="exam-info-group">

                  <div className="exam-icon">
                    <Clock size={20} />
                  </div>

                  <div className="exam-details">

                    <h4>
                      No Examination Scheduled
                    </h4>

                    <p>
                      Your upcoming examination will appear here.
                    </p>

                  </div>

                </div>
              )}

            </div>


            <div className="panel-footer">

              <span>
                {examSchedule
                  ? "Your scheduled examination"
                  : "No upcoming examination"}
              </span>

              <button
                className="action-link"
                onClick={() =>
                  navigate("/user/schedule")
                }
              >
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

            {activities.length > 0 ? (
              activities.map((activity, index) => (

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

              ))
            ) : (

              <div className="activity-item">

                <div className="activity-icon">
                  <User size={15} />
                </div>

                <div>

                  <h5>
                    Account Created
                  </h5>

                  <p>
                    Your profile is ready.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>


      </div>


    </div>
  );
}