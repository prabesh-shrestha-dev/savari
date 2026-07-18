import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <div>Navbar</div>
      <div>Sidebar</div>
      <Outlet />
      <div>Footer</div>
    </>
  )
}