// Test authentication endpoint
const testAuth = async () => {
    const token = 'demo-token';
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/getuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

testAuth();
