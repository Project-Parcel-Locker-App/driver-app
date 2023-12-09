import React, { useState,  } from 'react';
//import axios from 'axios';
import { BrowserRouter as Router, Link, Routes, Route, Outlet } from 'react-router-dom';
import Header from './Header';
import FreeCabinetsList from './Free/FreeCabinetsList';
import Pickup from './PickUp/Pickup';
import PickupDetail from './PickUp/PickupDetail';
import Deliver from './Deliver/Deliver';
import DeliverDetail from './Deliver/DeliverDetail';
import LoginForm from './LoginForm';
import ActiveParcelLockerSelector from './ActiveParcelLockerSelector';  
import '../App.css';

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
          <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
          <Route
            path="/selectlocker"
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
