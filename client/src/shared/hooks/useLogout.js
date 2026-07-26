import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/authContext";
import { logout } from "../services/authApi";

const useLogout = () => {

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const signout = async () => {
    try {
      const response = await logout();
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setAuth({});
      navigate('/login', { replace: true });
    }
  }

  return signout;
}

export default useLogout;