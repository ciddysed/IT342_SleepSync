import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!validateToken(navigate)) {
            return; // Redirect to login if token is invalid
        }
    }, [navigate]);

    return <>{children}</>;
};

export default ProtectedRoute;
