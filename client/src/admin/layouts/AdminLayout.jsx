import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <div>Navbar</div>
      <div>Sidebar</div>
      <Outlet />
      <div>Footer</div>
    </>
  )
}