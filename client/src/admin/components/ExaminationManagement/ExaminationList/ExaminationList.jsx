import { Search } from "lucide-react";
import ExaminationCard from "../ExaminationCard/ExaminationCard";
import "./ExaminationList.css";
import { useState } from "react";

export default function ExaminationList({
  applications,
  selectedStage,
  loading,
  actionLoading,
  onResult,
  onLicenseReady,
  onLicenseCollected,
}) {
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div className="examination-list-state">
        <div className="loading-spinner" />
        <p>Loading candidates...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="examination-list-state empty">
        <h3>No candidates found</h3>
        <p>
          There are currently no candidates in this
          examination stage.
        </p>
      </div>
    );
  }

  return (
    <div className="examination-list">
      <div className="examination-list-header">
        <h2>
          Candidates
        </h2>

        <div className="candidate-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="User Name / Email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="candidate-count">
          {applications.length} candidate
          {applications.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="examination-cards">
        {applications.map((application) => (
          <ExaminationCard
            key={application._id}
            application={application}
            selectedStage={selectedStage}
            actionLoading={actionLoading}
            onResult={onResult}
            onLicenseReady={onLicenseReady}
            onLicenseCollected={onLicenseCollected}
          />
        ))}
      </div>
    </div>
  );
}