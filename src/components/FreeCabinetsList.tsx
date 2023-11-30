import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Cabinet {
  id: number;
  locker_id: number;
  cabinet_size: string;
  cabinet_status: string;
  parcel: any; // Replace 'any' with the actual type of 'parcel'
}

interface FreeProps {
  lockerId: string;
}

const Free: React.FC<FreeProps> = ({ lockerId }) => {
  const [cabinetStates, setCabinetStates] = useState<string[]>([]);
  // cabinetsは削除しない
  // const [cabinets, setCabinets] = useState<Cabinet[]>([]);

  const fetchCabinetStates = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/lockers/${lockerId}`);
      
      const fetchedCabinets: Cabinet[] = response.data.cabinets || [];
      
      // Map to extract parcel information
      const cabinetStatusArray = fetchedCabinets.map((cabinet) => (cabinet.parcel !== null ? cabinet.parcel : null));
      
      console.log('cabinetStatusArray:', cabinetStatusArray);
            
      setCabinetStates(cabinetStatusArray);
      // setCabinets(filteredCabinets);
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

    // Counter for tracking the total number of cabinets
    let cabinetCount = 1;

    // Loop through each row
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      // Loop through each cabinet in the row
      for (let colIndex = 0; colIndex < 5; colIndex++) {
        // Updated to use cabinetStates directly to check if the cabinet is null
        const isFree = cabinetStates[cabinetCount - 1] === null;

        arrangedCabinets.push(
          <div
            key={cabinetCount}
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              border: '1px solid black',
              textAlign: 'center',
              backgroundColor: isFree ? 'green' : 'white',
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

  return (
    <div>
      <h2>Locker {lockerId}</h2>
      <h2>Free Cabinets</h2>

      {arrangeCabinets()}
    </div>
  );
};

export default Free;
