import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import { useAuth } from "../../shared/contexts/authContext";

export default function UserRoutes() {
  const { auth } = useAuth();
  const accessToken = auth.accessToken;
  const user = JSON.stringify(auth.user);

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="dashboard" element={<h1>User Dashboard {accessToken}, {user}</h1>} />
        <Route path="profile" element={<h1>User Profile</h1>} />
        <Route path="apply" element={<h1>User Apply</h1>} />
        <Route path="payment" element={<h1>User Payment</h1>} />
      </Route>

      <Route path="*" element={<h1>User path not found</h1>} />
    </Routes>
  )
}