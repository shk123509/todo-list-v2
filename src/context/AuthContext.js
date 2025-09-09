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
        
        // Load persisted profile from localStorage
        const storedProfile = localStorage.getItem('userProfile');
        let savedProfile = null;
        if (storedProfile) {
            try {
                savedProfile = JSON.parse(storedProfile);
            } catch (e) {
                console.log('Failed to parse stored profile');
            }
        }
        
        // Demo user for fallback with saved profile data merged
        const demoUser = {
            _id: 'demo-user-id',
            name: savedProfile?.name || 'MD Shakib Demo',
            email: savedProfile?.email || 'demo@newsboard.com',
            bio: savedProfile?.bio || 'NewsBoard Demo User - Full Stack Developer passionate about creating amazing user experiences.',
            location: savedProfile?.location || 'Mumbai, India',
            website: savedProfile?.website || 'https://newsboard.com',
            profilePicture: savedProfile?.profilePicture || null,
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
                        // Merge with saved profile data if available
                        const mergedUser = {
                            ...userData,
                            profilePicture: savedProfile?.profilePicture || userData.profilePicture,
                            bio: savedProfile?.bio || userData.bio,
                            location: savedProfile?.location || userData.location,
                            website: savedProfile?.website || userData.website
                        };
                        setUser(mergedUser);
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
            // Update local state
            const updatedUser = { ...user, ...profileData };
            setUser(updatedUser);
            
            // Store profile data in localStorage for persistence
            const profileToStore = {
                name: updatedUser.name,
                email: updatedUser.email,
                bio: updatedUser.bio,
                location: updatedUser.location,
                website: updatedUser.website,
                profilePicture: updatedUser.profilePicture
            };
            localStorage.setItem('userProfile', JSON.stringify(profileToStore));
            
            // If not demo mode, try to update on server
            if (authToken && authToken !== 'demo-token') {
                try {
                    const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
                    const response = await fetch(`${API_BASE}/api/auth/updateprofile`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": authToken
                        },
                        body: JSON.stringify(profileData)
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.user) {
                            setUser(data.user);
                        }
                    }
                } catch (error) {
                    console.log("Server update failed, using local storage", error);
                }
            }
            
            return { success: true };
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
