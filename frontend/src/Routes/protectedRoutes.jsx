import { useState, useEffect, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { VariableContext } from "../context/VariableContext";

const ProtectedRoute = ({ element, requiredRoles, ...rest }) => {
    const { isLoggedIn, token, host } = useContext(VariableContext);
    const [isValidToken, setIsValidToken] = useState(null); // Start with null to handle loading state
    const location = useLocation(); // Get current location for redirect

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsValidToken(false);
                return;
            }
            try {
                const response = await fetch(`${host}/auth/validateuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ requiredRoles }),
                });

                const data = await response.json();

                if (response.ok) {
                    if (requiredRoles.includes(data.role)) {
                        setIsValidToken(true); // Valid token with correct role
                    } else {
                        setIsValidToken(false); // Role mismatch
                        localStorage.clear();
                    }
                } else {
                    setIsValidToken(false); // Invalid response from backend
                    localStorage.clear();
                }
            } catch (error) {
                console.error("Error validating token:", error);
                setIsValidToken(false); // Any error in token validation
                localStorage.clear();
            }
        };

        if (isLoggedIn) {
            validateToken();
        } else {
            setIsValidToken(false); // Not logged in, redirect immediately
        }
    }, [isLoggedIn, token, requiredRoles, host]);

    // Render a loading state while validating the token
    if (isValidToken === null) {
        return <div>Loading...</div>;
    }

    // If token is invalid or user does not have the required role, redirect to login
    if (!isValidToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Return the protected route component if the token is valid
    return element;
};

export default ProtectedRoute;
