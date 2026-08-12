import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import LandingPage from "../pages/LandingPage/LandingPage";

export default function HomeRedirect() {
  const { auth } = useAuth();

  if (!auth?.accessToken) {
    return <LandingPage />;
  }

  if (auth.user?.role === "user") {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (auth.user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <LandingPage />;
}