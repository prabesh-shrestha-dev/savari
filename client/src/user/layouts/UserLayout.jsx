import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  CreditCard,
  IdCard,
  FilePlus
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import './UserLayout.css';

export default function UserLayout() {
  return (
    <div className="user-layout">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <NavLink to="/user/dashboard" className="sidebar-link">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/user/apply" className="sidebar-link">
            <FilePlus size={20} />
            <span>Apply for License</span>
          </NavLink>

          <NavLink to="/user/documents" className="sidebar-link">
            <FileText size={20} />
            <span>Documents</span>
          </NavLink>

          <NavLink to="/user/schedule" className="sidebar-link">
            <CalendarDays size={20} />
            <span>Schedule</span>
          </NavLink>

          <NavLink to="/user/payments" className="sidebar-link">
            <CreditCard size={20} />
            <span>Payments</span>
          </NavLink>

          <NavLink to="/user/license" className="sidebar-link">
            <IdCard size={20} />
            <span>My License</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}