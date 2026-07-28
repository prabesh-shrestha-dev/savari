import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import ApplicationReviewModal from "./ApplicationReviewModal";
import "./ApplicationsReview.css";

export default function ApplicationsReview() {
  const axiosPrivate = useAxiosPrivate();

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedApplication, setSelectedApplication] = useState(null);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axiosPrivate.get("/applications/review");

      setApplications(response.data?.applications);

    } catch (err) {
      console.error(
        "Failed to fetch applications:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load applications."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (isLoading) {
    return (
      <div className="applications-review">
        <div className="review-header">
          <h2>Review Applications</h2>
          <p>Review pending license applications.</p>
        </div>

        <div className="review-loading">
          Loading applications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-review">
        <div className="review-header">
          <h2>Review Applications</h2>
          <p>Review pending license applications.</p>
        </div>

        <div className="review-error">
          <p>{error}</p>

          <button onClick={fetchApplications}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-review">
      <div className="review-header">
        <div>
          <h2>Review Applications</h2>
          <p>
            Review and process pending license applications.
          </p>
        </div>

        <div className="application-count">
          {applications.length} Pending
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-applications">
          <h3>No Pending Applications</h3>
          <p>
            There are currently no applications waiting
            for review.
          </p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div
              key={application._id}
              className="application-card"
            >
              <div className="application-info">
                <h3>{application.fullName}</h3>

                <p>
                  <strong>Category:</strong>{" "}
                  {application.licenseCategory}
                </p>

                <p>
                  <strong>Identity Number:</strong>{" "}
                  {application.identityNumber}
                </p>

                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(
                    application.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="application-status">
                <span className="pending-badge">
                  Pending Review
                </span>

                <button
                  className="review-btn"
                  onClick={() => setSelectedApplication(application)}
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedApplication && (
        <ApplicationReviewModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onReviewSuccess={() => {
            setSelectedApplication(null);
            fetchApplications();
          }}
        />
      )}
    </div>
  );
}