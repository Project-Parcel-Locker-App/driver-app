import { useState } from 'react';

interface LoginFormProps {
  onLogin: (firstName: string ) => void;
}


const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) =>  {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/login`, {
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

        // サーバーからトークンを受け取ったと仮定
        const { _access_token_ } = data;

        // アクセストークンを保存
        //localStorage.setItem('_access_token_', data._access_token_);


        // アクセストークンをCookieに保存
        document.cookie = `_access_token_=${_access_token_}; SameSite=Lax`;


        console.log('Token saved:', data );

        // ログイン成功後にユーザー情報を取得
        fetchUserData(_access_token_);
        
       //redirect to home page
       // window.location.href = '/';  

      } else {
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserData = async (accessToken: string) => {
    const apiUrl = 'http://localhost:3000/api/users/9a543290-977a-4434-bb93-036f314dd2df';

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
        console.log('User Data:', userData);

        console.log(userData.first_name);

        onLogin(userData.first_name);
         
       /////////redirect to home page
        //window.location.href = '/';  
        //delete login form

        //nothing shows up
        
      


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
