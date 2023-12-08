import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

interface HeaderProps {
  isLoggedIn: boolean;
  userFirstName: string;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, userFirstName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redirect to login page after logout
    navigate('/login');
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

  // Check if token exists in cookie
  const isTokenExist = document.cookie.split(';').some((cookie) => cookie.trim().startsWith('_access_token_='));

  return (
    <div style={containerStyle}>
      {isTokenExist ? (
        <Link to="" style={linkStyle}>
          <div style={userInfoStyle}>
            <h2 style={{ margin: '0', marginRight: '20px' }}>Hi! {userFirstName}</h2>
            <LogoutButton onLogout={handleLogout} />
          </div>
        </Link>
      ) : (
        <h2 style={{ margin: '0' }}>Driver App</h2>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isTokenExist && (
          <>
            <Link to="/" style={linkStyle}>
              <h3>select Locker</h3>
            </Link>
            <Link to="/freeCabinets" style={linkStyle}>
              <h3>Free</h3>
            </Link>
            <Link to="/pickup" style={linkStyle}>
              <h3>Pickup</h3>
            </Link>
            <Link to="/deliver" style={linkStyle}>
              <h3>Deliver</h3>
            </Link>
          </>
        )}
        {!isTokenExist && (
          <Link to="/login" style={linkStyle}>
            <h3>Please Login</h3>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;