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
    <img
     // style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      onClick={handleLogout}
      src="src\assets\logout.png" // Specify the path to your logout image
      alt="Logout"
      style={{ height: '30px' }} // Adjust the style as needed
    />
  );
};

export default LogoutButton;
