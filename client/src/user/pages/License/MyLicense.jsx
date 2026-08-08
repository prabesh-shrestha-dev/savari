import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import licenseBackground from "../../../assets/000.png";
import licenseBack from "../../../assets/back.png";
import "./MyLicense.css";
import { useNavigate } from "react-router-dom";

export default function MyLicense() {
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

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
      setError(
        err.response?.data?.message ||
        "Failed to load your license."
      );
    } finally {
      setLoading(false);
    }
  };

  console.log(license);


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

        <h1>
          My <span>Driving License</span>
        </h1>

        <p>
          Your digital driving license.
        </p>

      </div>



      <div style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        gap: "40px",
        flexWrap: "wrap",
      }}>
        <div className="license-card" style={{
          backgroundImage: `url(${licenseBackground})`
        }}>


          <div className="license-overlay"></div>


          <div className="license-content">



            {/* Header */}

            <div className="card-header">

              <h2>
                Government of Nepal
              </h2>

              <p>
                Ministry of Physical Infrastructure & Transport
              </p>

              <h3>
                Driving License
              </h3>

            </div>



            {/* Body */}

            <div className="card-body">


              <div className="profile-photo">

                {license.passportSizePhoto ? (

                  <img
                    src={license.passportSizePhoto}
                    alt="Driver"
                  />

                ) : (

                  <span>
                    Photo
                  </span>

                )}

              </div>



              <div className="details-grid">


                <span className="label">
                  License No:
                </span>

                <span className="value">
                  {license.licenseNumber}
                </span>



                <span className="label">
                  Full Name:
                </span>

                <span className="value">
                  {license.fullName}
                </span>



                <span className="label">
                  DOB:
                </span>

                <span className="value">
                  {new Date(
                    license.dateOfBirth
                  ).toLocaleDateString()}
                </span>



                <span className="label">
                  Citizenship No:
                </span>

                <span className="value">
                  {license.identityNumber}
                </span>

                <span className="label">
                  Address:
                </span>

                <span className="value">
                  {license.permanentAddress}
                </span>


                <span className="label">
                  Issue Date:
                </span>

                <span className="value">
                  {new Date(
                    license.issueDate
                  ).toLocaleDateString()}
                </span>



                <span className="label">
                  Expiry Date:
                </span>

                <span className="value">
                  {new Date(
                    license.expiryDate
                  ).toLocaleDateString()}
                </span>


              </div>


            </div>




            {/* Footer */}

            <div className="card-footer">


              <div className="categories">

                Category: {" "}
                <span>
                  {license.licenseCategory}
                </span>

              </div>



              <img
                className="qr-code"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${license.licenseNumber}`}
                alt="QR Code"
              />


            </div>



          </div>


        </div>

        <div
          className="license-card license-back-card"
          style={{
            backgroundImage: `url(${licenseBack})`
          }}
        >
        </div>
      </div>

        {/* Safety Notice */}

        <div className="notice-card">

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <p className="prototype-note">
              This is not the original copy, this is just a prototype so not
              needed for real use.
            </p>

            <button className="renew-button" onClick={() => {
              navigate("/user/apply")
            }}>Renew</button>
          </div>

          <h3>
            Safety Notice
          </h3>

          <ul>

            <li>
              This card is not valid for driving or identification purposes.
            </li>

            <li>
              Carry your original government-issued driving licence while
              operating a motor vehicle.
            </li>

            <li>
              Always obey the Traffic Rules and Regulations of Nepal.
            </li>

            <li>
              Drive responsibly and never drive under the influence of alcohol
              or drugs.
            </li>

            <li>
              Always wear a seat belt or a certified helmet, as applicable.
            </li>

            <li>
              Follow speed limits and respect all traffic signs and signals.
            </li>

          </ul>


          <h3>
            Legal Notice
          </h3>

          <ul>
            <li>
              Unauthorized reproduction, misuse, or presentation of this sample
              card as an official document is strictly prohibited.
            </li>
          </ul>


        </div>


    </div>
  );
}