import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import ApplicationReviewModal from "./ApplicationReviewModal";
import "./ApplicationsReview.css";

export default function ApplicationsReview() {
  const axiosPrivate = useAxiosPrivate();

  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedApplication, setSelectedApplication] =
    useState(null);


  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axiosPrivate.get(
        "/applications/review"
      );

      const data = response.data?.applications || [];

      setApplications(data);
      setFilteredApplications(data);

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


  useEffect(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      setFilteredApplications(applications);
      return;
    }

    const filtered = applications.filter(
      (application) =>
        application.fullName
          ?.toLowerCase()
          .includes(value) ||
        application.user?.identifier
          ?.toLowerCase()
          .includes(value)
    );

    setFilteredApplications(filtered);

  }, [search, applications]);


  if (isLoading) {
    return (
      <div className="applications-review">
        <div className="review-loading">
          Loading applications...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="applications-review">

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
          <h2>
            Review <span style={{
              color: "#0048FF"
            }}>Applications</span>
          </h2>

          <p>
            Review and process pending license applications.
          </p>
        </div>


        <div className="review-tools">

          <div className="search-box">
            <Search size={18} className="search-icon" />

            <input
              type="text"
              placeholder="User Name / Email"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="application-count">
            {filteredApplications.length} Pending
          </div>

        </div>


      </div>



      {filteredApplications.length === 0 ? (

        <div className="empty-applications">

          <h3>
            No Applications Found
          </h3>

          <p>
            No matching applications available.
          </p>

        </div>

      ) : (

        <div className="applications-list">

          {filteredApplications.map((application) => (

            <div
              key={application._id}
              className="application-card"
            >

              <div className="applicant-photo">

                {application.documents?.passportSizePhoto?.url ? (

                  <img
                    src={
                      application.documents.passportSizePhoto.url
                    }
                    alt="Applicant"
                  />

                ) : (

                  <div className="photo-placeholder">
                    No Photo
                  </div>

                )}

              </div>


              <div className="application-info">

                <h3>
                  {application.fullName}
                </h3>

                <p className="identifier">
                  {application.user?.identifier}
                </p>

                <p className="submitted-date">
                  Submitted:{" "}
                  {new Date(
                    application.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>


              <div className="application-status">

                <span className="pending-badge">
                  Pending
                </span>


                <button
                  className="review-btn"
                  onClick={() =>
                    setSelectedApplication(application)
                  }
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

          onClose={() =>
            setSelectedApplication(null)
          }

          onReviewSuccess={() => {

            setSelectedApplication(null);

            fetchApplications();

          }}

        />

      )}

    </div>
  );
}