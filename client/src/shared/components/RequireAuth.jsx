import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/authContext";

const RequireAuth = ({ allowedRoles}) => {

  const { auth } = useAuth();

  if (!auth.accessToken) {
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RequireAuth