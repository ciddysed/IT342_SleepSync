import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = new URLSearchParams(location.search).get('token'); // Get token from query params

    useEffect(() => {
        if (token) {
            // Store the token, e.g., in localStorage
            localStorage.setItem('auth_token', token);
            // Redirect to landing page
            navigate('/user/landing');
        } else {
            // Redirect to an error page if token is not found
            navigate('/error/authorization_request_not_found');
        }
    }, [token, navigate]);

    return null; // Render nothing as the user is redirected
};

export default OAuthSuccess;
