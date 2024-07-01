/* eslint-disable react-hooks/exhaustive-deps */
import usePersist from "@/hooks/usePersist";
import { useRefreshMutation } from "@/redux/features/auth/authApiSlice";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "@/redux/features/auth/authSlice";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isPublic, routes }) => {
  const location = useLocation();
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const effectRan = useRef(false);
  const user_role = user?.user_role.role_description;
  const [refresh, { isUninitialized, isSuccess, isError }] =
    useRefreshMutation();
  let content;

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

      if (!token || persist) verifyRefreshToken();
    }
    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  const checkPer = () => {
    const route = routes.find((route) =>
      location.pathname.includes(route.path)
    );
    const getPermission = route?.permission;
    console.log("getPermission", getPermission);
    console.log(user_role);
    const checkRole = getPermission?.includes(user_role);
    console.log(checkRole);
    return checkRole;
  };

  if (isError) {
    //persist: yes, token: no
    console.log("error");
  } else if (isSuccess) {
    //persist: yes, token: yes
    // content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    console.log("token and uninit");
    // console.log(isUninitialized);
    // content = <Outlet />;
  } else if (!checkPer()) {
    content = <Navigate to={"/not-found"} />;
  } else {
    content = <Outlet />;
  }

  return isPublic || checkPer() ? <Outlet /> : content;
};

export default ProtectedRoute;
