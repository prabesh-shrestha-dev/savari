import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import "./MyLicense.css";

export default function MyLicense() {
  const axiosPrivate = useAxiosPrivate();

  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLicense();
  }, []);

  const fetchLicense = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosPrivate.get("/licenses/my");

      setLicense(response.data.license);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to load your license."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="license-loading">
        Loading license...
      </div>
    );
  }

  if (error) {
    return (
      <div className="license-error">
        {error}
      </div>
    );
  }

  if (!license) {
    return (
      <div className="license-empty">
        No digital license available.
      </div>
    );
  }

  return (
    <div className="license-page">

      <div className="page-header">
        <h1>My Driving License</h1>
        <p>Your digital driving license.</p>
      </div>

      <div className="license-card">

        <div className="license-top">

          <div>
            <div className="government">
              Government of Nepal
            </div>

            <div className="title">
              Driving License
            </div>
          </div>

          <div className={`status ${license.status}`}>
            {license.status}
          </div>

        </div>

        <div className="license-content">

          <div className="photo-box">
            {license.passportSizePhoto ? (
              <img
                src={license.passportSizePhoto}
                alt="Passport"
              />
            ) : (
              <span>No Photos</span>
            )}
          </div>

          <div className="license-details">

            <div className="detail">
              <span>License No.</span>
              <strong>{license.licenseNumber}</strong>
            </div>

            <div className="detail">
              <span>Full Name</span>
              <strong>{license.fullName}</strong>
            </div>

            <div className="detail">
              <span>Date of Birth</span>
              <strong>
                {new Date(
                  license.dateOfBirth
                ).toLocaleDateString()}
              </strong>
            </div>

            <div className="detail">
              <span>Blood Group</span>
              <strong>{license.bloodGroup}</strong>
            </div>

            <div className="detail">
              <span>Citizenship / NID</span>
              <strong>{license.identityNumber}</strong>
            </div>

            <div className="detail">
              <span>License Category</span>
              <strong>{license.licenseCategory}</strong>
            </div>

            <div className="detail">
              <span>Address</span>
              <strong>{license.permanentAddress}</strong>
            </div>

            <div className="detail">
              <span>Issue Date</span>
              <strong>
                {new Date(
                  license.issueDate
                ).toLocaleDateString()}
              </strong>
            </div>

            <div className="detail">
              <span>Expiry Date</span>
              <strong>
                {new Date(
                  license.expiryDate
                ).toLocaleDateString()}
              </strong>
            </div>

          </div>

        </div>

        <div className="license-footer">

          <div className="signature">
            <div className="line"></div>
            <small>Authorized Signature</small>
          </div>

          <div className="qr-box">
            QR
          </div>

        </div>

      </div>

    </div>
  );
}