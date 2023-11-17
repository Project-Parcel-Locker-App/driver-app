import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Cabinet {
  id: number;
  locker_id: number;
  cabinet_size: string;
  cabinet_status: string;
  parcel: any; // Replace 'any' with the actual type of 'parcel'
}

interface DeliverProps {
  lockerId: string;
}

const Deliver: React.FC<DeliverProps> = ({ lockerId }) => {
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
    // Fetch cabinet states from the backend
    fetchCabinetStates();
  }, [lockerId]);

  // Function to arrange cabinets in the specified format
  const arrangeCabinets = () => {
    const arrangedCabinets: JSX.Element[] = [];

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        const cabinetNumber = row * 4 + col + 1;

        const isDeliver = cabinetStates[cabinetNumber - 1] === 'available' && cabinets[cabinetNumber - 1]?.parcel == null;

        arrangedCabinets.push(
          <div
            key={cabinetNumber}
            style={{
              width: '80px',
              height: '80px',
              border: '1px solid black',
              textAlign: 'center',
              backgroundColor: isDeliver ? 'pink' : 'white', // Adjust color for DELIVER
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
      <h2>Deliver Cabinets at Parcel Locker {lockerId}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 80px)', gap: '10px' }}>
        {arrangeCabinets()}
      </div>
    </div>
  );
};

export default Deliver;
