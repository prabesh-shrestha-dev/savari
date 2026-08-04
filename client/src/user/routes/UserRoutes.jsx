import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import { useAuth } from "../../shared/contexts/authContext";
import Documents from "../pages/Documents/Documents";
import Application from "../pages/Application/Application";
import Schedule from "../pages/Schedule/Schedule";
import MyLicense from "../pages/License/MyLicense";

export default function UserRoutes() {
  const { auth } = useAuth();
  const accessToken = auth.accessToken;
  const user = JSON.stringify(auth.user);

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="dashboard" element={<h1>User Dashboard {accessToken}, {user}</h1>} />

        <Route path="apply" element={<Application />} />

        <Route path="documents" element={<Documents />} />

        <Route path="schedule" element={<Schedule />} />

        <Route path="payments" element={<h1>User Payments</h1>} />

        <Route path="license" element={<MyLicense />} />
      </Route>

      <Route path="*" element={<h1>User path not found</h1>} />
    </Routes>
  )
}