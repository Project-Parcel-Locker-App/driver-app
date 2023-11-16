// FreeCabinetsList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FreeCabinetsListProps {
  lockerId: string;
}

const FreeCabinetsList: React.FC<FreeCabinetsListProps> = ({ lockerId }) => {
  const [cabinetStates, setCabinetStates] = useState<string[]>([]);

  // Fetch cabinet states from the backend
  // const fetchCabinetStates = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3000/cabinets/${lockerId}/states`);
  //     setCabinetStates(response.data.cabinetStates);
  //   } catch (error) {
  //     console.error('Error fetching cabinet states:', error);
  //   }
  // };

  // useEffect(() => {
  //   // Fetch cabinet states from the backend
  //   fetchCabinetStates();
  // }, [lockerId]);

  // Dummy data
  const fetchCabinetStates = () => {
    // Assuming 15 cabinets, using dummy data
    const fakeCabinetStates = Array.from({ length: 15 }, (_, index) => {
      // Dummy condition: 'free' for odd indices, 'occupied' for even indices
      return index % 2 === 0 ? 'occupied' : 'free';
    });

    setCabinetStates(fakeCabinetStates);
  };

  useEffect(() => {
    // Fetch dummy data
    fetchCabinetStates();
  }, [lockerId]);

  return (
    <div>
      <h2>Free Cabinets at Parcel Locker {lockerId}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 80px)', gap: '10px' }}>
        {cabinetStates.map((state, index) => (
          <div
            key={index + 1}
            style={{
              width: '80px',
              height: '80px',
              border: '1px solid black',
              textAlign: 'center',
              backgroundColor: state === 'free' ? 'green' : 'white',
              color: 'black',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>{index + 1}</div>
            <div>{state === 'free' ? 'FREE' : '  '}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeCabinetsList;
