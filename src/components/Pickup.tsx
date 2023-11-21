import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Cabinet {
  id: number;
  locker_id: number;
  cabinet_size: string;
  cabinet_status: string;
  parcel: any; // Replace 'any' with the actual type of 'parcel'
}

interface PickupProps {
  lockerId: string;
}

const Pickup: React.FC<PickupProps> = ({ lockerId }) => {
  const [cabinetStates, setCabinetStates] = useState<string[]>([]);
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [selectedCabinet, setSelectedCabinet] = useState<number | null>(null);

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

    // Counter for tracking the total number of cabinets
    let cabinetCount = 1;

    // Loop through each row
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      // Loop through each cabinet in the row
      for (let colIndex = 0; colIndex < 5; colIndex++) {
        
        const isPickup = cabinetStates[cabinetCount - 1] === 'in-use' && cabinets[cabinetCount - 1]?.parcel !== null;
        const isSelected = selectedCabinet === cabinetCount;

        arrangedCabinets.push(
          <Link
            key={cabinetCount}
            to={`/pickup/${cabinetCount}`} //set cabinetCount as parameter
            style={{ textDecoration: 'none' }}
          >
            <div
              onClick={() => setSelectedCabinet(cabinetCount)}
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                border: '1px solid black',
                textAlign: 'center',
                backgroundColor: isSelected ? 'lightblue' : (isPickup ? 'pink' : 'white'),
                color: 'black',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer', // mouseover
              }}
            >
              <div>{cabinetCount}</div>
            </div>
          </Link>
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
      <h2>Pickup Cabinets </h2>
      {arrangeCabinets()}
    </div>
  );
};

export default Pickup;