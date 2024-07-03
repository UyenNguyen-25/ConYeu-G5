import { useRefreshMutation } from "@/redux/features/auth/authApiSlice";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          //const response =
          await refresh();
          //const { accessToken } = response.data
        } catch (err) {
          console.error(err);
        }
      };

      if (!token) verifyRefreshToken();
    }
    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  return children;
};

export default ProtectedRoute;
