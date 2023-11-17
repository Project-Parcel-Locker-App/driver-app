// DriverApp.tsx
import React, { useState } from 'react';
import ActiveParcelLockerSelector from './ActiveParcelLockerSelector';
import FreeCabinetsList from './FreeCabinetsList';
import Pickup from './Pickup'; // Pickup コンポーネントの追加
import Deliver from './Deliver'; // Deliver コンポーネントの追加

import '../App.css';

const DriverApp: React.FC = () => {
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<string>('freeCabinets'); // 表示モードの状態を管理

  // ロッカーが選択されたときのハンドラー
  const handleLockerSelect = (lockerId: string) => {
    setSelectedLocker(lockerId);
  };

  // 表示モードを切り替えるハンドラー
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
  };

  return (
    <>
      <h1>Driver App</h1>
      {/* アクティブなパーセルロッカーの選択コンポーネント */}
      <ActiveParcelLockerSelector onSelect={handleLockerSelect} />

      {/* ビューモードを切り替えるためのボタンなど */}
      <div>
        <button onClick={() => handleViewModeChange('freeCabinets')}>Free Cabinets</button>
        <button onClick={() => handleViewModeChange('pickup')}>Pickup</button>
        <button onClick={() => handleViewModeChange('deliver')}>Deliver</button>
      </div>

      {/* 表示モードに基づいてコンポーネントを切り替え */}
      {viewMode === 'freeCabinets' && (
        <>
          {selectedLocker && <p>Selected Parcel Locker: {selectedLocker}</p>}
          {/* 空きキャビネットのリストを表示するコンポーネント */}
          <FreeCabinetsList lockerId={selectedLocker || ''} />
        </>
      )}

      {viewMode === 'pickup' && (
        <>
          {selectedLocker && <p>Selected Parcel Locker: {selectedLocker}</p>}
          {/* Pickup コンポーネント */}
          <Pickup lockerId={selectedLocker || ''} />
        </>
      )}

      {viewMode === 'deliver' && (
        <>
          {selectedLocker && <p>Selected Parcel Locker: {selectedLocker}</p>}
          {/* Deliver コンポーネント */}
          <Deliver lockerId={selectedLocker || ''} />
        </>
      )}

      
    </>
  );
};

export default DriverApp;
