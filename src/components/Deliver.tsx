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

  const arrangeCabinets = () => {
    const arrangedCabinets: JSX.Element[] = [];

    // Counter for tracking the total number of cabinets
    let cabinetCount = 1;

    // Loop through each row
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      // Loop through each cabinet in the row
      for (let colIndex = 0; colIndex < 5; colIndex++) {

        const isDeliver = cabinetStates[cabinetCount - 1] === 'available' && cabinets[cabinetCount - 1]?.parcel == null;

        arrangedCabinets.push(
          <div
            key={cabinetCount}
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              border: '1px solid black',
              textAlign: 'center',
              backgroundColor: isDeliver ? 'yellow' : 'white',
              color: 'black',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>{cabinetCount}</div>
          </div>
        );

        // Increment the cabinet count
        cabinetCount++;
      }
    }

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 80px)',
          gap: '10px',
          justifyContent: 'center',
          border: '2px solid black',
          padding: '10px',
        }}
      >
        {arrangedCabinets}
      </div>
    );
  };


/*   // Function to arrange cabinets in the specified format
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
  }; */

  return (
    <div>
      <h2>Locker {lockerId}</h2>
      <h2>Deliver Cabinets</h2>
        {arrangeCabinets()}
    </div>
  );
};

export default Deliver;
