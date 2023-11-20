import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Link, Routes, Route, Outlet } from 'react-router-dom';
import FreeCabinetsList from './FreeCabinetsList';
import Pickup from './Pickup';
import Deliver from './Deliver';

import '../App.css';

const ActiveParcelLockerSelector: React.FC<{ onSelect: (lockerId: string) => void }> = ({ onSelect }) => {
  const [activeLockers, setActiveLockers] = useState<string[]>([]);
  const [nearestLockerId, setNearestLockerId] = useState<string | null>(null);

  useEffect(() => {
    // Use the backend endpoint to get the nearest locker ID
    // The driver ID is fixed since there's only one driver
    axios.get('http://localhost:3000/api/lockers/nearest/21c4622e-31cc-4883-a9f4-b01b831343b1')
      .then((response) => {
        // Set the nearest locker ID to the state
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
      {/* Display buttons for each locker ID */}
      <div style={{ display: 'flex' }}>
        {activeLockers
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((lockerId) => (
            <button
              key={lockerId}
              onClick={() => onSelect(lockerId)}
              style={{
                fontSize: lockerId === nearestLockerId ? '20px' : '14px',
                marginRight: '10px',
                padding: lockerId === nearestLockerId ? '15px' : '10px',
                backgroundColor: lockerId === nearestLockerId ? 'yellow' : 'white',
              }}
            >
              <Link to={`/locker/${lockerId}`}>Locker {lockerId}</Link>
            </button>
          ))}
      </div>
    </div>
  );
};

const DriverApp: React.FC = () => {
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);

  // Handler for when a locker is selected
  const handleLockerSelect = (lockerId: string) => {
    setSelectedLocker(lockerId);
  };

  return (
    <Router>
      <div>
        <h1>Driver App</h1>

        {/* Locker selection screen */}
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
                <Link to="/freeCabinets">
                  <button>Free Cabinets</button>
                </Link>
                <Link to="/pickup">
                  <button>Pickup</button>
                </Link>
                <Link to="/deliver">
                  <button>Deliver</button>
                </Link>
                <Outlet />
              </div>
            }
          />
        </Routes>

        {/* Views for each action */}
        <Routes>
          <Route path="/freeCabinets" element={<FreeCabinetsList lockerId={selectedLocker || ''} />} />
          <Route path="/pickup" element={<Pickup lockerId={selectedLocker || ''} />} />
          <Route path="/deliver" element={<Deliver lockerId={selectedLocker || ''} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default DriverApp;
