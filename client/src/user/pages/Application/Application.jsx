import { useState } from 'react';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import useAxiosPrivate from '../../../shared/hooks/useAxiosPrivate';
import './Application.css';

export default function Application() {
  const axiosPrivate = useAxiosPrivate();

  const [showPaymentModal, setShowPaymentModal] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    identityNumber: '',
    bloodGroup: '',
    permanentAddress: '',
    temporaryAddress: '',
    licenseCategory: 'A',
  });

  const categories = [
    { id: 'A', label: 'A', description: 'Motorcycle / scooter' },
    { id: 'B', label: 'B', description: 'Car / jeep / van' },
    { id: 'K', label: 'K', description: 'Small scooter (100cc)' },
    { id: 'H', label: 'H', description: 'Heavy vehicle' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({ ...prev, licenseCategory: categoryId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setIsSubmitting(true);

      const response = await axiosPrivate.post(
        "/applications",
        {
          ...formData,

          payment: {
            status: paymentData.status,
            transactionId: paymentData.transactionId,
          },
        }
      );

      console.log("Application created: ", response.data);

      setShowPaymentModal(false);

      alert("Payment successful! Your application has been submitted.");

    } catch (error) {
      console.error(
        "Application submission error: ",
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
    <div className="application-page">
      <div className="form-card">

        <div className="form-header">
          <div>
            <h3>Apply For License</h3>
            <p>
              Fill in your details to begin your driving license application.
            </p>
          </div>

          <div className="application-fee-badge">
            Application Fee: <strong>Rs. 500</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-body">

          <div className="form-section">
            <div className="section-heading">
              <span className="section-number">1</span>

              <div>
                <h4>Personal Information</h4>
                <p>Enter your personal details exactly as shown on your identification document.</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label className="form-label">
                  Full name
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Prabesh Shrestha"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Date of birth
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
                  placeholder="XX-XX-XX-XXXXX"
                  value={formData.identityNumber}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Blood group
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

                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

            </div>
          </div>

          <div className="form-section">
            <div className="section-heading">
              <span className="section-number">2</span>

              <div>
                <h4>Address Information</h4>
                <p>Provide your permanent and current residential addresses.</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label className="form-label">
                  Permanent address
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  name="permanentAddress"
                  placeholder="Sworgadwari Municipality - 4, Pyuthan"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Temporary address
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  name="temporaryAddress"
                  placeholder="Sworgadwari Municipality - 4, Pyuthan"
                  value={formData.temporaryAddress}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

            </div>
          </div>

          <div className="form-section">
            <div className="section-heading">
              <span className="section-number">3</span>

              <div>
                <h4>License Category</h4>
                <p>Select the type of vehicle you want to apply for.</p>
              </div>
            </div>

            <div className="category-grid">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`category-card ${
                    formData.licenseCategory === cat.id ? 'selected' : ''
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
                    {formData.licenseCategory === cat.id ? '✓' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-footer">

            <div className="payment-notice">
              <span className="notice-icon">ⓘ</span>

              <p>
                You will be asked to complete the <strong>Rs. 500</strong> application
                fee payment before your application is submitted.
              </p>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="apply-btn"
                disabled={isSubmitting}
              >
                Continue to Payment
                <span className="button-arrow">→</span>
              </button>
            </div>

          </div>

        </form>
      </div>

      {showPaymentModal && (
        <PaymentModal
          amount={500}
          title="Application Fee"
          description="Complete your payment to submit your license application."
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
