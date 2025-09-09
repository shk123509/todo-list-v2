import { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

    const login = async (email, password) => {
        try {
            const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.authtoken) {
                localStorage.setItem("token", data.authtoken);
                setAuthToken(data.authtoken);
                // Fetch user details
                const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
                const userResponse = await fetch(`${API_BASE}/api/auth/getuser`, {
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
        setAuthToken(null);
    };

    const checkAuthStatus = useCallback(async () => {
        const token = localStorage.getItem("token");
        
        // Demo user for fallback
        const demoUser = {
            _id: 'demo-user-id',
            name: 'MD Shakib Demo',
            email: 'demo@newsboard.com',
            bio: 'NewsBoard Demo User - Full Stack Developer passionate about creating amazing user experiences.',
            location: 'Mumbai, India',
            website: 'https://newsboard.com',
            profilePicture: null,
            joinedAt: '2024-01-01T00:00:00.000Z'
        };
        
        // If there's a valid token and it's not demo token, try to authenticate
        if (token && token !== 'demo-token') {
            try {
                const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
                const response = await fetch(`${API_BASE}/api/auth/getuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    if (userData && !userData.error) {
                        setUser(userData);
                        setIsAuthenticated(true);
                        setAuthToken(token);
                        setLoading(false);
                        return;
                    }
                }
            } catch (error) {
                console.error("Auth check error:", error);
            }
            
            // If token validation failed, remove it
            localStorage.removeItem("token");
        }
        
        // Use demo mode as fallback
        console.log("Using demo mode");
        setUser(demoUser);
        setIsAuthenticated(true);
        setAuthToken('demo-token');
        localStorage.setItem('token', 'demo-token');
        setLoading(false);
    }, []);

    // Check auth status once on mount
    useEffect(() => {
        let mounted = true;
        
        const initAuth = async () => {
            if (mounted) {
                await checkAuthStatus();
            }
        };
        
        initAuth();
        
        return () => {
            mounted = false;
        };
    }, [checkAuthStatus]); // Add checkAuthStatus to dependency array

    const updateProfile = async (profileData) => {
        try {
            // For demo purposes, just update local state
            setUser(prevUser => ({ ...prevUser, ...profileData }));
            return { success: true };
            
            // In real app, would make API call:
            /* 
            const response = await fetch("http://localhost:5000/api/auth/updateprofile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": authToken
                },
                body: JSON.stringify(profileData)
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                return { success: true };
            }
            return { success: false, message: data.message };
            */
        } catch (error) {
            console.error("Profile update error:", error);
            return { success: false, message: "Failed to update profile" };
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            loading, 
            authToken, 
            login, 
            logout, 
            checkAuthStatus, 
            updateProfile 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
