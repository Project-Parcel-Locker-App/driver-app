import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { Link } from 'react-router-dom';

interface Cabinet {
  id: number;
  locker_id: number;
  cabinet_size: string;
  cabinet_status: string;
  parcel: {
    id: number;
    parcel_status: string;
  } | null;
}

interface PickupProps {
  lockerId: string;
}

const Pickup: React.FC<PickupProps> = ({ lockerId }) => {
  const [fetchedCabinets, setFetchedCabinets] = useState<Cabinet[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState<number | null>(null);

  const fetchCabinetStates = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/lockers/${lockerId}/cabinets`);
      //const response = await axios.get(`http://localhost:3000/api/lockers/${lockerId}`);
      
      const fetchedCabinets: Cabinet[] = response.data.cabinets || [];
            
      setFetchedCabinets(fetchedCabinets);
    } catch (error) {
      console.error('Error fetching cabinet states:', error);
    }
  };

  useEffect(() => {
    fetchCabinetStates();
  }, [lockerId]);

  const handleCabinetClick = (parcelId: number | null) => {
    setSelectedParcelId(parcelId);
  };

  const handleConfirmAndPickup = async () => {
    if (selectedParcelId !== null) {
      try {
        // Add appropriate authentication information (e.g., a token)
        //const authToken = ' _access_token_'; // Replace with your actual token
        const response = await axios.post(
          'http://localhost:3000/api/parcels/update',
          {
            parcelId: selectedParcelId,
            status: 'delivered', 
          },
           /* {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }  */
        );
  
        console.log(response.data); 
       
      } catch (error) {
        console.error('Error confirming and picking up:', error);
      }
    } else {
      console.warn('No parcel selected.');
    }
  };
  

 /* 
  const handleConfirmAndPickup = () => {
    // Implement the logic for confirming and picking up the selected parcel
    if (selectedParcelId !== null) {
      // Add your confirmation and pickup logic here
      console.log(`Confirmed and Picked up Parcel ID: ${selectedParcelId}`);
    } else {
      console.warn('No parcel selected.');
    }
  }; */

  const arrangeCabinets = () => {
    const arrangedCabinets: JSX.Element[] = [];

    // Counter for tracking the total number of cabinets
    let cabinetCount = 1;

    // Loop through each row
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      // Loop through each cabinet in the row
      for (let colIndex = 0; colIndex < 5; colIndex++) {
        const cabinet = fetchedCabinets[cabinetCount - 1];
        const parcelId = cabinet?.parcel?.id || null;
        const isInTransit = cabinet?.parcel?.parcel_status === 'in-transit';

        arrangedCabinets.push(
          <div
            key={cabinetCount}
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              border: '1px solid black',
              textAlign: 'center',
              backgroundColor: isInTransit ? '#FFD500' : 'white',
              color: 'black',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer', // mouseover
            }}
            onClick={() => handleCabinetClick(parcelId)}
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
      
      <h2>Pickup Cabinets </h2>
      
      <p>The colored cabinets contain a parcel. </p>
      <p>Please select a cabinet and proceed with picking up the parcel.</p>
      <h2>Locker {lockerId}</h2>
      {arrangeCabinets()}
      {selectedParcelId !== null && (
        <div>
          <p>Selected Parcel ID: {selectedParcelId}</p>
          <button onClick={handleConfirmAndPickup}>Confirm and Pickup</button>
        </div>
      )}
    </div>
  );
};

export default Pickup;
