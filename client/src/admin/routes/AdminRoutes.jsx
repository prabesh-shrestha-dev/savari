import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<h1>Admin Dashboard</h1>} />
        <Route path="users" element={<h1>User List</h1>} />
        <Route path="applications" element={<h1>User Applications</h1>} />
        <Route path="payments" element={<h1>User Payments</h1>} />
      </Route>

      <Route path="*" element={<h1>Admin path not found</h1>} />
    </Routes>
  )
}