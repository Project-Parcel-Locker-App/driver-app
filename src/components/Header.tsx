// Header.tsx
import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface HeaderProps {
  isLoggedIn: boolean;
  userFirstName: string;
 
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, userFirstName }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/logout',
        { user_id: '9a543290-977a-4434-bb93-036f314dd2df' },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {

        console.log('Logout successful:', response.data);
        
        //delete from cookie
        document.cookie = '_access_token_=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';

     

        // redirect to login page
        navigate('/login');

      } else {
        console.error('Logout failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    background: '#870939',
    color: 'white',
    zIndex: '1000',
    padding: '15px',
    justifyContent: 'space-between',
  };

  const linkStyle = { textDecoration: 'none', color: 'white', marginRight: '20px', letterSpacing: '2px' };
  const userInfoStyle = { display: 'flex', alignItems: 'center' };

  return (
    <div style={containerStyle}>
      <Link to="/" style={linkStyle}>
        {isLoggedIn ? (
          <div style={userInfoStyle}>
            <h2 style={{ margin: '0', marginRight: '20px' }}>Hi! {userFirstName}</h2>
            <button style={{ background: 'white', border: 'none', color: 'black', cursor: 'pointer' }} onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <h2 style={{ margin: '0' }}>Driver App</h2>
        )}
      </Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <Link to="/freeCabinets" style={linkStyle}>
              <h3>Free Cabinets</h3>
            </Link>
            <Link to="/pickup" style={linkStyle}>
              <h3>Pickup</h3>
            </Link>
            <Link to="/deliver" style={linkStyle}>
              <h3>Deliver</h3>
            </Link>
          </>
        ) : (
          <Link to="/login" style={linkStyle}>
            <h3>Please Login</h3>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
