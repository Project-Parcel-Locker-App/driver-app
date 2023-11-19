import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Routes, Route, Outlet } from 'react-router-dom';
import FreeCabinetsList from './FreeCabinetsList';
import Pickup from './Pickup';
import Deliver from './Deliver';

import '../App.css';

const ActiveParcelLockerSelector: React.FC<{ onSelect: (lockerId: string) => void }> = ({ onSelect }) => {
  const lockerIds = ['1', '2', '3', '4', '5']; // ロッカーのIDリスト

  return (
    <div>
      <h2>Select Active Parcel Locker</h2>
      {/* ロッカーIDごとにボタンを表示 */}
      {lockerIds.map((lockerId) => (
        <button key={lockerId} onClick={() => onSelect(lockerId)}>
          <Link to={`/locker/${lockerId}`}>Locker {lockerId}</Link>
        </button>
      ))}
    </div>
  );
};

const DriverApp: React.FC = () => {
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);

  // ロッカーが選択されたときのハンドラー
  const handleLockerSelect = (lockerId: string) => {
    setSelectedLocker(lockerId);
  };

  return (
    <Router>
      <div>
        <h1>Driver App</h1>

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
