import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DocumentsReview from "../pages/Documents/DocumentsReview";
import ApplicationsReview from "../pages/Applications/ApplicationsReview";
import ScheduleManagement from "../pages/ScheduleManagement/ScheduleManagement";
import ExaminationManagement from "../pages/ExaminationManagement/ExaminationManagement";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="applications" element={<ApplicationsReview />} />
        <Route path="documents" element={<DocumentsReview />} />
        <Route path="schedules" element={<ScheduleManagement />} />
        <Route path="examinations" element={<ExaminationManagement />} />
      </Route>

      <Route path="*" element={<h1>Admin path not found</h1>} />
    </Routes>
  )
}