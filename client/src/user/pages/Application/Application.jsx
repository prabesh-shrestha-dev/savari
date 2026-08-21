import { useState } from "react";
import ApplicationConfirmModal from "./ApplicationConfirmModal";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import "./Application.css";

export default function Application() {
  const axiosPrivate = useAxiosPrivate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    identityNumber: "",
    bloodGroup: "",
    permanentAddress: "",
    temporaryAddress: "",
    licenseCategory: "A",
  });

  const categories = [
    {
      id: "A",
      label: "A",
      description: "Motorcycle / Scooter",
    },
    {
      id: "B",
      label: "B",
      description: "Car / Jeep / Van",
    },
    {
      id: "K",
      label: "K",
      description: "Small Scooter (100cc)",
    },
    {
      id: "H",
      label: "H",
      description: "Heavy Vehicle",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      licenseCategory: categoryId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowConfirmModal(true);
  };

  const handleConfirmApplication = async () => {
    try {
      setIsSubmitting(true);

      const response = await axiosPrivate.post(
        "/applications",
        formData
      );

      console.log(response.data);

      alert("Application submitted successfully.");

      setShowConfirmModal(false);

    } catch (error) {
      console.error(
        "Application submission error:",
        error.response?.data?.message || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="application-page">
        <div className="form-card">

          <div className="form-header">
            <div>
              <h3>Apply for a <span style={{
                color: "#0048FF"
              }}>Driving License</span></h3>

              <p>
                Fill in your details to begin your driving
                license application.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="form-body"
          >

            {/* PERSONAL INFORMATION */}

            <div className="form-section">
              <div className="section-heading">
                <span className="section-number">
                  1
                </span>

                <div>
                  <h4>Personal Information</h4>

                  <p>
                    Enter your personal details exactly
                    as shown on your identification
                    document.
                  </p>
                </div>
              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label className="form-label">
                    Full Name
                    <span className="required">*</span>
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter Your Full Name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Date of Birth
                    <span className="required">*</span>
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Citizenship No. / NIN
                    <span className="required">*</span>
                  </label>

                  <input
                    type="text"
                    name="identityNumber"
                    value={formData.identityNumber}
                    onChange={handleChange}
                    placeholder="XX-XX-XX-XXXXX"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Blood Group
                    <span className="required">*</span>
                  </label>

                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="" disabled>
                      Select Blood Group
                    </option>

                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>

              </div>
            </div>

            {/* ADDRESS */}

            <div className="form-section">
              <div className="section-heading">
                <span className="section-number">
                  2
                </span>

                <div>
                  <h4>Address Information</h4>

                  <p>
                    Provide your permanent and temporary
                    addresses.
                  </p>
                </div>
              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label className="form-label">
                    Permanent Address
                    <span className="required">*</span>
                  </label>

                  <input
                    type="text"
                    name="permanentAddress"
                    placeholder="Enter Your Permanent Address"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Temporary Address
                    <span className="required">*</span>
                  </label>

                  <input
                    type="text"
                    name="temporaryAddress"
                    placeholder="Enter Your Temporary Address"
                    value={formData.temporaryAddress}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

              </div>
            </div>

            {/* CATEGORY */}

            <div className="form-section">
            <div className="section-heading">

              <div className="section-left">
                <span className="section-number">
                  3
                </span>

                <div>
                  <h4>License Category</h4>

                  <p>
                    Select the vehicle category you wish
                    to apply for.
                  </p>
                </div>
              </div>


              <button className="see-more">
                See More
              </button>

            </div>

              <div className="category-grid">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      handleCategorySelect(cat.id)
                    }
                    className={`category-card ${
                      formData.licenseCategory === cat.id
                        ? "selected"
                        : ""
                    }`}
                  >
                    <span className="category-letter">
                      {cat.label}
                    </span>

                    <div className="category-content">
                      <div className="category-title">
                        Category {cat.label}
                      </div>

                      <div className="category-desc">
                        {cat.description}
                      </div>
                    </div>

                    <span className="category-check">
                      {formData.licenseCategory === cat.id
                        ? "✓"
                        : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* FOOTER */}

            <div className="form-footer">

              <div className="payment-notice">
                <span className="notice-icon">ⓘ</span>

                <p>
                  Please ensure all information is
                  accurate before submitting your
                  application.
                </p>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="apply-btn"
                  disabled={isSubmitting}
                >
                  Continue
                  <span className="button-arrow">
                    →
                  </span>
                </button>
              </div>

            </div>

          </form>
        </div>
      </div>

      <ApplicationConfirmModal
        open={showConfirmModal}
        loading={isSubmitting}
        onClose={() =>
          setShowConfirmModal(false)
        }
        onConfirm={handleConfirmApplication}
      />
    </>
  );
}