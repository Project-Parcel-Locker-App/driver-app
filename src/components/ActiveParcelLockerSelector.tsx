import React, { useState, useEffect } from 'react';

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

    // 一から五までのデータを使用
    const lockers = ['1', '2', '3', '4', '5'];
    setActiveLockers(lockers);
  }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <div>
      <label>Select Active Parcel Locker: </label>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="">Select an active locker</option>
        {activeLockers.map((lockerId) => (
          <option key={lockerId} value={lockerId}>
            Parcel Locker {lockerId}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ActiveParcelLockerSelector;
