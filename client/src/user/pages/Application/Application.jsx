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
    <div className="form-card">
      <div className="form-header">
        <h3>Apply For License</h3>
      </div>

      <form onSubmit={handleSubmit} className="form-body">
        <div className="form-group">
          <label className="form-label">Full name</label>
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
          <label className="form-label">Date of birth</label>
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
          <label className="form-label">Citizenship No. / NIN</label>
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
          <label className="form-label">Blood group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="" disabled>Select Blood Group</option>
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

        {/* Permanent Address */}
        <div className="form-group">
          <label className="form-label">Permanent address</label>
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
          <label className="form-label">Temporary address</label>
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

        <div className="form-group">
          <label className="form-label" style={{ marginBottom: '0.5rem' }}>
            LIc category
          </label>
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
                <span className="category-letter">{cat.label}</span>
                <div>
                  <div className="category-title">
                    Category {cat.label}
                  </div>
                  <div className="category-desc">
                    {cat.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="apply-btn">
            Apply
          </button>
        </div>
      </form>

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
};