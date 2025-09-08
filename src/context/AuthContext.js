import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.authtoken) {
                localStorage.setItem("token", data.authtoken);
                // Fetch user details
                const userResponse = await fetch("http://localhost:5000/api/auth/getuser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": data.authtoken
                    }
                });
                const userData = await userResponse.json();
                
                setUser(userData);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { 
                    success: false, 
                    message: data.error || "Invalid credentials" 
                };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { 
                success: false, 
                message: "An error occurred during login" 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
    };

    const checkAuthStatus = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await fetch("http://localhost:5000/api/auth/getuser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    }
                });
                const userData = await response.json();
                if (userData.success !== false) {
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Auth check error:", error);
                localStorage.removeItem("token");
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
