import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import DocumentReviewModal from "./DocumentReviewModal";

import "./DocumentsReview.css";

export default function DocumentsReview() {
  const axiosPrivate = useAxiosPrivate();

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosPrivate.get(
        "/documents/admin"
      );

      setDocuments(
        response.data.documents || []
      );

    } catch (err) {
      console.error(
        "Failed to fetch documents:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load documents."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const getOverallStatus = (document) => {
    const statuses = [
      document.identityCard?.status,
      document.passportSizePhoto?.status,
      document.bloodGroupReport?.status,
    ];

    if (
      statuses.every(
        (status) => status === "approved"
      )
    ) {
      return "approved";
    }

    if (
      statuses.some(
        (status) => status === "rejected"
      )
    ) {
      return "rejected";
    }

    return "pending";
  };

  const filteredDocuments = documents.filter(
    (document) => {
      const name =
        document.user?.fullname?.toLowerCase() ||
        "";

      const identifier =
        document.user?.identifier?.toLowerCase() ||
        "";

      const value = search.toLowerCase();

      return (
        name.includes(value) ||
        identifier.includes(value)
      );
    }
  );

  if (loading) {
    return (
      <div className="documents-review-page">
        <div className="loading-state">
          Loading documents...
        </div>
      </div>
    );
  }

  return (
    <div className="documents-review-page">

      <div className="documents-header">

        <div>
          <h1 style={{
            fontWeight: "700"
          }}>
            Review <span style={{
              color: "#0048FF",
            }}>Documents</span>
          </h1>

          <p>
            Review and verify applicant documents.
          </p>
        </div>


        <div className="header-actions">

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

          <span>
            {filteredDocuments.length} Applicants
          </span>

        </div>

      </div>


      {error && (
        <div className="documents-error">
          {error}
        </div>
      )}


      {filteredDocuments.length === 0 ? (

        <div className="empty-documents">

          <h2>
            No Documents Found
          </h2>

          <p>
            There are no applicants available
            for document review.
          </p>

        </div>

      ) : (

        <div className="applicant-grid">

          {filteredDocuments.map(
            (document) => {

              const status =
                getOverallStatus(
                  document
                );

              return (

                <div
                  className="applicant-card"
                  key={document._id}
                >

                  <h3>
                    {
                      document.user?.fullname
                    }
                  </h3>


                  <p>
                    {
                      document.user?.identifier
                    }
                  </p>


                  <span
                    className={`status ${status}`}
                  >
                    {
                      status
                    }
                  </span>


                  <button
                    className="review-button"
                    onClick={() =>
                      setSelectedDocument(
                        document
                      )
                    }
                  >
                    Review
                  </button>

                </div>

              );

            }
          )}

        </div>

      )}


      {selectedDocument && (
        <DocumentReviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDocumentUpdate={(updatedDocument) => {
            setDocuments((prevDocuments) =>
              prevDocuments.map((item) =>
                item._id === updatedDocument._id
                  ? updatedDocument
                  : item
              )
            );

            setSelectedDocument(updatedDocument);
          }}
        />
      )}

    </div>
  );
}