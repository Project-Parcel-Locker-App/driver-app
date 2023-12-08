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
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);

  const fetchCabinetStates = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/lockers/${lockerId}/cabinets`);
      const fetchedCabinets: Cabinet[] = response.data.cabinets || [];
      
      // idプロパティを基準に昇順にソートする
      const sortedCabinets = fetchedCabinets.sort((a, b) => a.id - b.id);

      console.log('sortedCabinets:', sortedCabinets);

      // Map to extract parcel information
      const cabinetStatusArray = sortedCabinets.map((cabinet) => (cabinet.parcel !== null ? cabinet.parcel : null));
      
      console.log('cabinetStatusArray:', cabinetStatusArray);
      console.log('fetchCabinetStates - lockerId:', lockerId);

      setCabinetStates(cabinetStatusArray);
      setCabinets(sortedCabinets);
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
        const cabinet = cabinets[cabinetCount - 1];
        const isFree = !cabinet?.parcel || (cabinet?.parcel && cabinet?.parcel?.parcel_status === null);


        arrangedCabinets.push(
          <div
            key={cabinetCount}
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              border: '1px solid black',
              textAlign: 'center',
              backgroundColor: isFree ? '#23856D' : 'white',
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
      <h2>Free Cabinets</h2>
      <p>The colored cabinets are empty.</p>
      <h2>Locker {lockerId}</h2>
      {arrangeCabinets()}
    </div>
  );
};

export default Free;
