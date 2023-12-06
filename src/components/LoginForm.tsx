import { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log('Login successful:', data.message);

        console.log('data:', data);

        // サーバーからトークンを受け取ったと仮定
        const { _access_token_ } = data;

        // アクセストークンをCookieに保存
        document.cookie = `_access_token_=${_access_token_}; HttpOnly; SameSite=None`;

        console.log('Cookie saved:', _access_token_);

        // ユーザーをダッシュボードまたは別のページにリダイレクト
        // ここにリダイレクトのコードを追加
        window.location.href = '/'; 
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
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
        <label style={{ marginBottom: '2px', color: '#870939', display: 'block' }}>Username</label>
        <input
          type="text"
          placeholder="Enter Your Username"
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
        onClick={handleSubmit}
      >
        Log In
      </button>
    </div>
  );
};

export default LoginForm;
