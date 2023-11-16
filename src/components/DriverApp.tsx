// DriverApp.tsx
import React, { useState } from 'react';
import ActiveParcelLockerSelector from './ActiveParcelLockerSelector';
import FreeCabinetsList from './FreeCabinetsList';

import '../App.css';

const DriverApp: React.FC = () => {
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);

  const handleLockerSelect = (lockerId: string) => {
    setSelectedLocker(lockerId);
  };

  return (
    <>
      <h1>Driver App</h1>
      <ActiveParcelLockerSelector onSelect={handleLockerSelect} />
      {selectedLocker && <p>Selected Parcel Locker: {selectedLocker}</p>}
      <FreeCabinetsList lockerId={selectedLocker || ''} />
      {/* Add other components and features for parcel pick up, and parcel delivery */}
    </>
  );
};

export default DriverApp;
