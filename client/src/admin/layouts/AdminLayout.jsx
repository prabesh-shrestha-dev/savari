import { Outlet } from "react-router-dom";
import Sidebar from "../../shared/components/Sidebar/Sidebar";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar role="admin" />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}