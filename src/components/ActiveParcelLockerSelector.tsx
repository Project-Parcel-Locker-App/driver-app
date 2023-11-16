// ActiveParcelLockerSelector.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ActiveParcelLockerSelectorProps {
  onSelect: (lockerId: string) => void;
}

const ActiveParcelLockerSelector: React.FC<ActiveParcelLockerSelectorProps> = ({ onSelect }) => {
  const [activeLockers, setActiveLockers] = useState<string[]>([]);

  useEffect(() => {
    // バックエンドのエンドポイントが用意されるまでコメントアウトしておく
    /*
    axios.get('http://localhost:3000/active-lockers')
      .then((response) => {
        setActiveLockers(response.data.activeLockers);
      })
      .catch((error) => {
        console.error('Error fetching active lockers:', error);
      });
    */
  }, []); // Empty dependency array to ensure the effect runs only once

  // 一から五までの仮のデータ
  const dummyLockers = ['1', '2', '3', '4', '5'];

  return (
    <div>
      <label>Select Active Parcel Locker: </label>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="">Select an active locker</option>
        {activeLockers.length > 0 ? (
          activeLockers.map((lockerId) => (
            <option key={lockerId} value={lockerId}>
              Parcel Locker {lockerId}
            </option>
          ))
        ) : (
          // ダミーデータを使用
          dummyLockers.map((lockerId) => (
            <option key={lockerId} value={lockerId}>
              Parcel Locker {lockerId}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default ActiveParcelLockerSelector;
