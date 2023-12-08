import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Link, Routes, Route, Outlet } from 'react-router-dom';
import Header from './Header';
import FreeCabinetsList from './FreeCabinetsList';
import Pickup from './Pickup';
import Deliver from './Deliver';
import PickupDetail from './PickupDetail';
import DeliverDetail from './DeliverDetail';
import LoginForm from './LoginForm';

import '../App.css';

const ActiveParcelLockerSelector: React.FC<{ onSelect: (lockerId: string, street: string) => void }> = ({ onSelect }) => {
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
      <h2  style={{ marginTop : '100px' }}>Select Active Parcel Locker</h2>
      <div style={{ display: 'flex' , flexDirection: 'column'}}>
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


const DriverApp: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string>(''); 

  const handleLockerSelect = (lockerId: string) => {
    setSelectedLocker(lockerId);
    console.log('Selected Locker ID:', lockerId);
  };

  
  const handleLogin = (firstName: string) => {
    
    setUserFirstName(firstName);
    setLoggedIn(true);
  };


  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn} userFirstName={userFirstName} />
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
         
          <Route
            path="/"
            element={
              <div>
                <ActiveParcelLockerSelector onSelect={(lockerId) => handleLockerSelect(lockerId)} />
                <Outlet />
              </div>
            }
          />
          <Route
            path="/locker/:lockerId"
            element={
              <div>
                <h2>Select cabinets status</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to="/freeCabinets">
                    <button style={{ backgroundColor: 'rgb(241, 226, 231)', padding: '20px', border: 'none', cursor: '#F1E2E7' }}>Free Cabinets</button>
                  </Link>
                  <Link to="/pickup">
                    <button style={{ backgroundColor: 'rgb(241, 226, 231)', padding: '20px', border: 'none', cursor: 'pointer' }}>Pickup</button>
                  </Link>
                  <Link to="/deliver">
                    <button style={{ backgroundColor: 'rgb(241, 226, 231)', padding: '20px', border: 'none', cursor: 'pointer' }}>Deliver</button>
                  </Link>
                </div>
                <Outlet />
              </div>
            }
          />
          <Route path="/pickup/:cabinetId" element={<PickupDetail lockerId={selectedLocker || ''} />} />
          <Route path="/deliver/:cabinetId" element={<DeliverDetail lockerId={selectedLocker || ''} />} />
          <Route path="/freeCabinets" element={<FreeCabinetsList lockerId={selectedLocker || ''} />} />
          <Route path="/pickup" element={<Pickup lockerId={selectedLocker || ''} />} />
          <Route path="/deliver" element={<Deliver lockerId={selectedLocker || ''} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default DriverApp;
