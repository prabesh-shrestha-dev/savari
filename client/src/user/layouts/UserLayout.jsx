import { Outlet } from "react-router-dom";
import './UserLayout.css';
import Sidebar from "../../shared/components/Sidebar/Sidebar";

export default function UserLayout() {
  return (
    <div className="user-layout">
      <Sidebar role="user" />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}