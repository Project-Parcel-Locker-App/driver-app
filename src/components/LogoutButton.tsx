import React from 'react';
import axios from 'axios';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
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

        // Delete token from cookie
        document.cookie = '_access_token_=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';

        // Delete user ID from cookie
        document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';

        // Trigger the parent component's onLogout function
        onLogout();
      } else {
        console.error('Logout failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button
      style={{ background: 'white', border: 'none', color: 'black', cursor: 'pointer' }}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
