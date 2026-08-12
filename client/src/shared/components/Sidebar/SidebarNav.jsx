import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  CreditCard,
  IdCard,
  FilePlus,
  ClipboardCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./SidebarNav.css";

export default function SidebarNav({ role, onNavigate }) {
  const userLinks = [
    {
      label: "Dashboard",
      to: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Documents",
      to: "/user/documents",
      icon: FileText,
    },
    {
      label: "Apply for License",
      to: "/user/apply",
      icon: FilePlus,
    },
    {
      label: "Schedule",
      to: "/user/schedule",
      icon: CalendarDays,
    },
    {
      label: "Payments",
      to: "/user/payments",
      icon: CreditCard,
    },
    {
      label: "My License",
      to: "/user/license",
      icon: IdCard,
    },
  ];

  const adminLinks = [
    {
      label: "Dashboard",
      to: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Review Documents",
      to: "/admin/documents",
      icon: FileText,
    },
    {
      label: "Review Applications",
      to: "/admin/applications",
      icon: FilePlus,
    },
    {
      label: "Manage Schedules",
      to: "/admin/schedules",
      icon: CalendarDays,
    },
    {
      label: "Manage Examinations",
      to: "/admin/examinations",
      icon: ClipboardCheck,
    },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  return (
    <nav className="sidebar-nav">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={onNavigate}
          >
            <Icon size={20} />

            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}