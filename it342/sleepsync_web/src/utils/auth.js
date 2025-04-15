import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode

export const validateToken = (navigate) => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login"); // Redirect to login if token is missing
        return false;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            localStorage.removeItem("token"); // Clear expired token
            localStorage.removeItem("userId");
            navigate("/login"); // Redirect to login if token is expired
            return false;
        }
        return true;
    } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
        return false;
    }
};

export const logoutUser = (navigate) => {
    localStorage.removeItem("token"); // Clear the JWT token
    localStorage.removeItem("userId"); // Clear the user ID
    navigate("/login"); // Redirect to the login page
};
