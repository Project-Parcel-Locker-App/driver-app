import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PickupProps {
  lockerId: string;
}

interface Cabinet {
  id: number;
  locker_id: number;
  cabinet_size: string;
  cabinet_status: string;
  parcel: any; // Replace 'any' with the actual type of 'parcel'
}

const Pickup: React.FC<PickupProps> = ({ lockerId }) => {
  const [cabinetStates, setCabinetStates] = useState<string[]>([]);
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);

  const fetchCabinetStates = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/lockers/${lockerId}`);
      const fetchedCabinets: Cabinet[] = response.data.cabinets || [];
      const cabinetStatusArray = fetchedCabinets.map((cabinet) => cabinet.cabinet_status);
      console.log('cabinetStatusArray:', cabinetStatusArray);
      setCabinetStates(cabinetStatusArray);
      setCabinets(fetchedCabinets);
    } catch (error) {
      console.error('Error fetching cabinet states:', error);
    }
  };

  useEffect(() => {
    fetchCabinetStates();
  }, [lockerId]);

  const arrangeCabinets = () => {
    const arrangedCabinets: JSX.Element[] = [];

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        const cabinetNumber = row * 4 + col + 1;
        const isPickup = cabinetStates[cabinetNumber - 1] === 'in-use' && cabinets[cabinetNumber - 1]?.parcel !== null;

        arrangedCabinets.push(
          <div
            key={cabinetNumber}
            style={{
              width: '80px',
              height: '80px',
              border: '1px solid black',
              textAlign: 'center',
              backgroundColor: isPickup ? 'blue' : 'white', // Adjust color for PICKUP
              color: 'black',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>{cabinetNumber}</div>
          </div>
        );
      }
    }

    return arrangedCabinets;
  };

  return (
    <div>
      <h2>Pickup Cabinets at Parcel Locker {lockerId}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 80px)', gap: '10px' }}>
        {arrangeCabinets()}
      </div>
    </div>
  );
};

export default Pickup;
