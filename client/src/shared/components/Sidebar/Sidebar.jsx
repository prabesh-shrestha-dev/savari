import { useNavigate } from "react-router-dom";
import LogoBox from "./LogoBox";
import SidebarNav from "./SidebarNav";
import UserMenu from "./UserMenu";
import { useAuth } from "../../contexts/authContext";
import useLogout from "../../hooks/useLogout";
import "./Sidebar.css";
import { ArrowRight } from "lucide-react";

export default function Sidebar({ role }) {
  const { auth } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login", {
        replace: true,
      });

    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

return (
  <aside className="sidebar">
    <LogoBox role={role} />

    <SidebarNav role={role} />

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
);
}