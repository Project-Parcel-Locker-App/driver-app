import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
interface LoginFormProps {
  onLogin: (firstName: string ) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) =>  {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);

       
        const { _access_token_ } = data;

        // keep the token in local storage
        //localStorage.setItem('_access_token_', data._access_token_);

        // keep the token in cookie
        document.cookie = `_access_token_=${_access_token_}; SameSite=Lax`;
        // keep the user id in cookie
        document.cookie = `user_id=${data.user_id}; SameSite=Lax`;

        // fetch user data
        fetchUserData(_access_token_);
        
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserData = async (accessToken: string) => {

     // Split the cookie string into an array of individual cookies
     const cookies = document.cookie.split(';');
     // Find the cookie containing 'user_id' and extract its value
     const userIdCookie = cookies.find((cookie) => cookie.includes('user_id'));
     const userId = userIdCookie ? userIdCookie.split('=')[1] : null;

    const apiUrl = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/users/${userId}`;
   // const apiUrl = 'http://localhost:3000/api/users/9a543290-977a-4434-bb93-036f314dd2df';

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const userData = await response.json();

      if (response.ok) {
    
        onLogin(userData.first_name);  
        navigate('/selectlocker');

      } else {
        console.error('Error:', userData);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const inputStyle = {
    width: '100%',
    height: '40px',
    borderRadius: '8px',
    border: '2px solid #870939',
    padding: '5px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>

      <img src="src\assets\rocket.png" alt="Logo" style={{ color: '#870939', width: '150px', marginBottom: '20px' }} />
      <div style={{ marginBottom: '10px', textAlign: 'left', width: '300px' }}>
        <label style={{ marginBottom: '2px', color: '#870939', display: 'block' }}>Username/Email</label>
        <input
          type="text"
          placeholder="Enter Your Username/Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: '10px', textAlign: 'left', width: '300px' }}>
        <label style={{ marginBottom: '2px', color: '#870939', display: 'block' }}>Password</label>
        <input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
      </div>
      <button
          style={{ backgroundColor: '#870939', color: 'white', width: '200px', height: '50px', borderRadius: '8px', marginTop: '40px' }}
          onClick={handleLogin}
       >
        Log In
      </button>
      
    </div>
  );
};

export default LoginForm;
