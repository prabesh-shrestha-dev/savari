import { useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import axiosPrivate from "../services/api";
import useRefreshToken from "./useRefreshToken";
import useLogout from "./useLogout";

const useAxiosPrivate = () => {

  const { auth } = useAuth();
  const refresh = useRefreshToken();
  const logout = useLogout();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use((config) => {
      if (!config.headers?.Authorization && auth?.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error.config;
        if ((error.response?.status === 403 || error.response?.status === 401) && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            const newAccessToken = await refresh();

            if (prevRequest.headers?.set) {
              prevRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
            } else {
              prevRequest.headers = {
                ...prevRequest.headers,
                Authorization: `Bearer ${newAccessToken}`,
              };
            }

            return axiosPrivate(prevRequest)
          } catch (err) {
            console.error("Refresh token expired or invalid → Logging out");
            await logout();
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    }
  }, [auth, refresh, logout])

  return axiosPrivate;
};

export default useAxiosPrivate;