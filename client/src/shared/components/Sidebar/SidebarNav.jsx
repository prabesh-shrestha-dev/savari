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

export default function SidebarNav({ role }) {
  const userLinks = [
    {
      label: "Dashboard",
      to: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Apply for License",
      to: "/user/apply",
      icon: FilePlus,
    },
    {
      label: "Documents",
      to: "/user/documents",
      icon: FileText,
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
      label: "Review Applications",
      to: "/admin/applications",
      icon: FilePlus,
    },
    {
      label: "Review Documents",
      to: "/admin/documents",
      icon: FileText,
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
          >
            <Icon size={20} />

            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}