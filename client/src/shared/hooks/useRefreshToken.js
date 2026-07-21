import { useAuth } from "../contexts/authContext";
import { refresh } from "../services/authApi";

const useRefreshToken = () => {

  const { setAuth } = useAuth();

  const handleRefresh = async () => {
    try {
      const response = await refresh();
      const { accessToken, user } = response.data;
      setAuth({ 
        accessToken,
        user
      });
      return accessToken;

    } catch (err) {
      throw err;
    }
  }

  return handleRefresh;
};

export default useRefreshToken;