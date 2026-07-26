import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DocumentsReview from "../../pages/Documents/DocumentsReview";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<h1>Admin Dashboard</h1>} />
        <Route path="applications" element={<h1>Applications review</h1>} />
        <Route path="documents" element={<DocumentsReview />} />
        <Route path="schedules" element={<h1>Generate schedule</h1>} />
      </Route>

      <Route path="*" element={<h1>Admin path not found</h1>} />
    </Routes>
  )
}