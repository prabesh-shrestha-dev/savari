import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";


const PersistLogin = () => {

  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    !auth.accessToken ? verifyRefreshToken() : setIsLoading(false);  

    return () => {
      isMounted = false;
    }
  }, [auth.accessToken, refresh])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <Outlet />

};

export default PersistLogin;