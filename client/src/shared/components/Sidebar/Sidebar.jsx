import { useNavigate } from "react-router-dom";
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
      <LogoBox />

      <SidebarNav role={role} />

      <UserMenu
        user={auth.user}
        onLogout={handleLogout}
      />
    </aside>
  );
}