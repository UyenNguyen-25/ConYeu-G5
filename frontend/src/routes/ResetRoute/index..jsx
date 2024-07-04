/* eslint-disable react-hooks/exhaustive-deps */
import { useSendLogoutMutation } from "@/redux/features/auth/authApiSlice";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const ResetToken = ({ children }) => {
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);
    const [signout] = useSendLogoutMutation()

    useEffect(() => {

        const deleteToken = async () => {
            try {
                await signout();
            } catch (err) {
                console.error(err);
            }
        };

        if (token) deleteToken()

        return () => (effectRan.current = true);
    }, []);

    return children;
};

export default ResetToken;
