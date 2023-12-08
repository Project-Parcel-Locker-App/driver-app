import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ActiveParcelLocker {
  locker_id: string;
  street: string;
  distance: number; // Add the distance property to the type
}

interface ActiveParcelLockerSelectorProps {
  onSelect: (lockerId: string, street: string, distance: number) => void;
}

const ActiveParcelLockerSelector: React.FC<ActiveParcelLockerSelectorProps> = ({ onSelect }) => {
  const [activeLockers, setActiveLockers] = useState<ActiveParcelLocker[]>([]);
  const [nearestLockerId, setNearestLockerId] = useState<string | null>(null);

  const getAccessTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === '_access_token_') {
        return value;
      }
    }
    return null;
  };

  const accessToken = getAccessTokenFromCookie();
  console.log('Access token:', accessToken);

  useEffect(() => {
    const fetchData = async (accessToken: string) => {
      try {
        // Split the cookie string into an array of individual cookies
        const cookies = document.cookie.split(';');
  
        // Find the cookie containing 'user_id' and extract its value
        const userIdCookie = cookies.find((cookie) => cookie.includes('user_id'));
        const userId = userIdCookie ? userIdCookie.split('=')[1] : null;
  
        if (userId) {
          // Construct the API URL using the retrieved user ID
          const apiUrl = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/users/${userId}/nearby-lockers`;
  
          // Make the axios request with the constructed URL
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
  
          console.log('Active lockers response:', response.data);
          setNearestLockerId(response.data[0]?.locker_id || null);
          setActiveLockers(response.data.map((locker: any) => ({ 
            locker_id: locker.locker_id, 
            street: locker.street ,
            distance: locker.distance

          })));
        } else {
          console.error('User ID not found in cookie.');
        }
      } catch (error) {
        console.error('Error fetching active lockers:', error);
      }
    };
  
    const accessToken = getAccessTokenFromCookie();
    if (accessToken) {
      fetchData(accessToken);
    }
  }, []); // Empty dependency array to ensure the effect runs only once  

  return (
    <div>
      <h2 style={{ marginTop: '' }}>Select Active Parcel Locker</h2>
      <p>The red locker is the nearest one to you.</p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activeLockers
          .sort((a, b) => parseInt(a.locker_id) - parseInt(b.locker_id))
          .map(({ locker_id, street, distance }) => (
            <button
              key={locker_id}
              onClick={() => onSelect(locker_id, street, distance )}
              style={{
                fontSize: locker_id === nearestLockerId ? '20px' : '14px',
                marginRight: '20px',
                marginTop: '20px',
                marginBottom: '5px',
                padding: locker_id === nearestLockerId ? '15px' : '10px',
                backgroundColor: locker_id === nearestLockerId ? '#870939' : '#BDBBBC',
                color: locker_id === nearestLockerId ? 'white' : 'black',
                whiteSpace: 'pre-line',
                width: '100%',
              }}
            >
              <Link to={`/locker/${locker_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div>Locker {locker_id}</div>
                <div>{street} </div>
                <div>{distance}km</div>
              </Link>
            </button>
          ))}
      </div>
    </div>
  );
};

export default ActiveParcelLockerSelector;
