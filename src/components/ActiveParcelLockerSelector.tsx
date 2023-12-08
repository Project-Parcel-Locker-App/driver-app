import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ActiveParcelLockerSelectorProps {
  onSelect: (lockerId: string, street: string) => void;
}

const ActiveParcelLockerSelector: React.FC<ActiveParcelLockerSelectorProps> = ({ onSelect }) => {
  const [activeLockers, setActiveLockers] = useState<{ locker_id: string; street: string }[]>([]);
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
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/users/9a543290-977a-4434-bb93-036f314dd2df/nearby-lockers`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Active lockers response:', response.data);
        setNearestLockerId(response.data[0]?.locker_id || null);
        setActiveLockers(response.data.map((locker: any) => ({ locker_id: locker.locker_id, street: locker.street })));
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
          .map(({ locker_id, street }) => (
            <button
              key={locker_id}
              onClick={() => onSelect(locker_id, street)}
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
                <div>{street}</div>
              </Link>
            </button>
          ))}
      </div>
    </div>
  );
};

export default ActiveParcelLockerSelector;
