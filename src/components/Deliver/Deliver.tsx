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

interface DeliverProps {
  lockerId: string;
}

const Deliver: React.FC<DeliverProps> = ({ lockerId }) => {
  const [cabinetStates, setCabinetStates] = useState<string[]>([]);
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  console.log(cabinets,cabinetStates);

  const fetchCabinetStates = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/lockers/${lockerId}/cabinets`);
      
      //const response = await axios.get(`http://localhost:3000/api/lockers/${lockerId}`);

      const fetchedCabinets: Cabinet[] = response.data.cabinets || [];
      
      const sortedCabinets = fetchedCabinets.sort((a, b) => a.id - b.id);
      console.log('sortedCabinets:', sortedCabinets);

      const cabinetStatusArray = fetchedCabinets.map((cabinets) => cabinets.parcel);
      
      console.log('cabinetDeliverStatusArray:', cabinetStatusArray);
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

        const cabinet = cabinets[cabinetCount - 1];
        //const parcelId = cabinet?.parcel?.id || null;
        const isNull = !cabinet?.parcel && cabinet?.parcel?.parcel_status !== null;
        //const isDeliver = cabinetStates[cabinetCount - 1]  == null;

        arrangedCabinets.push(
          <Link
          key={cabinetCount}
          to={`/deliver/${cabinetCount}`} 
          style={{ textDecoration: 'none' }}
        >
          <div
            key={cabinetCount}
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              border: '1px solid black',
              textAlign: 'center',
              backgroundColor: isNull ? '#1A659E' : 'white',
              color: 'black',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
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
      
      <h2 style={{ marginTop: '70px' }}>Deliver Cabinets</h2>
    
      <p>You can deliver to the colored cabinets.  </p>
      <p>Please choose one cabinet</p>
      <p> and proceed to the screen to select the parcel for delivery.</p>
      <h2>Locker {lockerId}</h2>
        {arrangeCabinets()}
    </div>
  );
};

export default Deliver;
