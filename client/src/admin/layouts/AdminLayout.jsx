import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  FilePlus
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import './AdminLayout.css';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className="sidebar-link">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/applications" className="sidebar-link">
            <FilePlus size={20} />
            <span>Review Applications</span>
          </NavLink>

          <NavLink to="/admin/documents" className="sidebar-link">
            <FileText size={20} />
            <span>Review Documents</span>
          </NavLink>

          <NavLink to="/admin/schedules" className="sidebar-link">
            <CalendarDays size={20} />
            <span>Manage Schedules</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}