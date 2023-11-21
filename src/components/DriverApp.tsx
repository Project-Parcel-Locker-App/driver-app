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
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Link to="/">
        <h3 style={{ margin: '0', marginRight: '20px' }}>Driver App</h3>
      </Link>
      <Link to="/freeCabinets">
        <button>Free Cabinets</button>
      </Link>
      <Link to="/pickup">
        <button>Pickup</button>
      </Link>
      <Link to="/deliver">
        <button>Deliver</button>
      </Link>
    </div>
  );
};


const ActiveParcelLockerSelector: React.FC<{ onSelect: (lockerId: string) => void }> = ({ onSelect }) => {
  const [activeLockers, setActiveLockers] = useState<string[]>([]);
  const [nearestLockerId, setNearestLockerId] = useState<string | null>(null);


  useEffect(() => {
    // one driver
    axios.get('http://localhost:3000/api/lockers/nearest/21c4622e-31cc-4883-a9f4-b01b831343b1')
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
      {/* display botton according to locker id */}
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

  
  const handleLockerSelect = (lockerId: string) => {
    setSelectedLocker(lockerId);
  };

  return (
    <Router>
      <div>

        {/* ヘッダー */}
        <Header />
       

        {/* ロッカー選択画面 */}
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
                </div>
                <Outlet />
              </div>
            }
          />
          
         <Route
            path="/pickup/:cabinetId"
            element={<PickupDetail lockerId={selectedLocker || ''} />}
          />


         <Route
            path="/deliver/:cabinetId"
            element={<DeliverDetail lockerId={selectedLocker || ''} />}
          />




        </Routes>

      

        {/* 各ビュー */}
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
