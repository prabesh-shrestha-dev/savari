import { useState } from "react";
import { uploadDocument } from "../../services/documentApi";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import useLogout from "../../../shared/hooks/useLogout";

export default function Documents() {
  const [identityCard, setIdentityCard] = useState(null);
  const [passportSizePhoto, setPassportSizePhoto] = useState(null);
  const [bloodGroupReport, setBloodGroupReport] = useState(null);

  const [loadingField, setLoadingField] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();

  const handleUpload = async (e, fieldName, file) => {
    e.preventDefault();

    if (!file) {
      setStatusMessage(`Please select a file for ${fieldName} first.`);
      return;
    }

    const formData = new FormData();
    formData.append(fieldName, file);

    setLoadingField(fieldName);
    setStatusMessage("");

    try {
      const response = await axiosPrivate.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status === 200 || response.status === 201) {
        setStatusMessage(`Successfully uploaded ${fieldName}!`);
      }

    } catch (err) {
      console.error("Upload error: ", err);
      const errorMessage = err.response?.data?.message || "Upload failed. Please try again.";
      setStatusMessage(errorMessage);

    } finally {
      setLoadingField(null);
    }
  };

  return (
    <div>
      {statusMessage && (
        <p style={{ fontWeight: "bold", margin: "10px 0" }}>{statusMessage}</p>
      )}

      {/* Form 1: Identity Card */}
      <form
        onSubmit={(e) =>
          handleUpload(e, "identityCard", identityCard)
        }
      >
        <h2>Citizenship or NID</h2>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setIdentityCard(e.target.files[0])}
        />
        <button type="submit" disabled={loadingField === "identityCard"}>
          {loadingField === "identityCard" ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Form 2: Passport Photo */}
      <form
        onSubmit={(e) =>
          handleUpload(e, "passportSizePhoto", passportSizePhoto)
        }
      >
        <h2>Passport-size Photo</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPassportSizePhoto(e.target.files[0])}
        />
        <button type="submit" disabled={loadingField === "passportSizePhoto"}>
          {loadingField === "passportPhoto" ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Form 3: Blood Group Report */}
      <form
        onSubmit={(e) =>
          handleUpload(
            e,
            "bloodGroupReport",
            bloodGroupReport
          )
        }
      >
        <h2>Blood Group Report</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBloodGroupReport(e.target.files[0])}
        />
        <button type="submit" disabled={loadingField === "bloodGroupReport"}>
          {loadingField === "bloodGroupReport" ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* <div className="uploaded-docs">
        <img src="https://res.cloudinary.com/dhc3b01bn/image/upload/v1785000896/LicenseHubDocs/sample_blood_report-1785000893476.webp"></img>
      </div> */}

      <button onClick={logout}>Logout</button>
    </div>
  );
}