import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Link, Routes, Route, Outlet } from 'react-router-dom';
import FreeCabinetsList from './FreeCabinetsList';
import Pickup from './Pickup';
import Deliver from './Deliver';
import PickupDetail from './PickupDetail';
import DeliverDetail from './DeliverDetail';

import '../App.css';

const Header: React.FC = () => {
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

  return (
    <div style={containerStyle}>
      <Link to="/" style={linkStyle}>
        <h2 style={{ margin: '0' }}>Driver App</h2>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/freeCabinets" style={linkStyle}>
          <h3>Free Cabinets</h3>
        </Link>
        <Link to="/pickup" style={linkStyle}>
          <h3>Pickup</h3>
        </Link>
        <Link to="/deliver" style={linkStyle}>
          <h3>Deliver</h3>
        </Link>
      </div>
    </div>
  );
};

const ActiveParcelLockerSelector: React.FC<{ onSelect: (lockerId: string) => void }> = ({ onSelect }) => {
  const [activeLockers, setActiveLockers] = useState<string[]>([]);
  const [nearestLockerId, setNearestLockerId] = useState<string | null>(null);

  useEffect(() => {
    // one driver
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/lockers/nearest/7c57fb0e-5477-49d7-b7c9-0da4f21a9799`)
      .then((response) => {
        setNearestLockerId(response.data[0]?.locker_id || null);
        setActiveLockers(response.data.map((locker: any) => locker.locker_id));
      })
      .catch((error) => {
        console.error('Error fetching active lockers:', error);
      });
  }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <div>
      <h2>Select Active Parcel Locker</h2>
      <div style={{ display: 'flex' }}>
        {activeLockers
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((lockerId) => (
            <button
              key={lockerId}
              onClick={() => onSelect(lockerId)}
              style={{
                fontSize: lockerId === nearestLockerId ? '20px' : '14px',
                marginRight: '20px',
                padding: lockerId === nearestLockerId ? '15px' : '10px',
                backgroundColor: lockerId === nearestLockerId ? '#870939' : '#BDBBBC',
                color: lockerId === nearestLockerId ? 'white' : 'black',
              }}
            >
              <Link to={`/locker/${lockerId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                Locker {lockerId}
              </Link>
            </button>
          ))}
      </div>
    </div>
  );
};

const DriverApp: React.FC = () => {
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);

  const handleLockerSelect = (lockerId: string) => {
    setSelectedLocker(lockerId);
  };

  return (
    <Router>
      <div>
        <Header />
        <Routes>
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
