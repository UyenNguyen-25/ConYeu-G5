/* eslint-disable react-hooks/exhaustive-deps */
import { selectCurrentToken, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CheckPermissionRoute = ({ children }) => {
    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectCurrentUser)
    const effectRan = useRef(false);
    const [isCheck, setIsCheck] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== "development") {
            // React 18 Strict Mode

            const verifyUserRole = () => {
                const role = user.user_role.role_description
                if (role === "customer") {
                    navigate("/")
                }
                setIsCheck(true)
            };

            if (token) { verifyUserRole() } else navigate("/")
        }
        return () => (effectRan.current = true);

        // eslint-disable-next-line
    }, []);
    return isCheck && children
};

export default CheckPermissionRoute;
