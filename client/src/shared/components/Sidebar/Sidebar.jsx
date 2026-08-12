import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Menu } from "lucide-react";

import LogoBox from "./LogoBox";
import SidebarNav from "./SidebarNav";
import UserMenu from "./UserMenu";

import { useAuth } from "../../contexts/authContext";
import useLogout from "../../hooks/useLogout";

import "./Sidebar.css";

export default function Sidebar({ role }) {
  const { auth } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/", {
        replace: true,
      });

    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>
        )}

      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
      >        
        <LogoBox 
          role={role} 
          onNavigate={closeSidebar} 
        />

        <SidebarNav 
          role={role} 
          onNavigate={closeSidebar}
        />

        <div className="support-box">

          <h4>
            Need Assistance?
          </h4>

          <p>
            Our support is here to help.
          </p>

          <button className="support-link">
            Contact support
            <ArrowRight size={15} />
          </button>

        </div>


        <UserMenu
          user={auth.user}
          onLogout={handleLogout}
        />

      </aside>
    </>
  );
}