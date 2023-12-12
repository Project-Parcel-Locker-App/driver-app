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
    status: string;
  } | null;
}

interface PickupProps {
  lockerId: string;
}

const Pickup: React.FC<PickupProps> = ({ lockerId }) => {
  const [fetchedCabinets, setFetchedCabinets] = useState<Cabinet[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState<number | null>(null);
  const [selectedCabinetId, setSelectedCabinetId] = useState<number | null>(null); // 新しいステート

  const fetchCabinetStates = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/lockers/${lockerId}/cabinets`);
      //const response = await axios.get(`http://localhost:3000/api/lockers/${lockerId}`);
      
   
      const fetchedCabinets: Cabinet[] = response.data.cabinets || [];

      const sortedCabinets = fetchedCabinets.sort((a, b) => a.id - b.id);

      console.log('sortedCabinets:', sortedCabinets);
            
      setFetchedCabinets(fetchedCabinets);
    } catch (error) {
      console.error('Error fetching cabinet states:', error);
    }
  };

  useEffect(() => {
    fetchCabinetStates();
  }, [lockerId]);

  const handleCabinetClick = (parcelId: number | null) => {
    // Find the clicked cabinet from fetchedCabinets
    const clickedCabinet = fetchedCabinets.find((cabinet) => cabinet.parcel?.id === parcelId);
    if (clickedCabinet) {
      setSelectedParcelId(parcelId);
      setSelectedCabinetId(clickedCabinet.id);
      console.log('Selected Cabinet ID:', clickedCabinet.id);
    }
  };

////////////////////////////////////////////////////////////////////
  const handleConfirmAndPickup = async () => {
    if (selectedParcelId !== null&& selectedCabinetId !== null) {
      try {
        // Add appropriate authentication information (e.g., a token)
        const authTokenRow = document.cookie
        .split('; ')
        .find(row => row.startsWith('_access_token_='));

      const authToken = authTokenRow ? authTokenRow.split('=')[1] : undefined;

        if (authToken) {
          console.log(authToken);
        } else {
          console.error('Access token not found in cookies.');
        }

        const cabinetsID = selectedCabinetId;

        //処理一個目　ロッカー user
        const response = await axios.patch(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/users/9a543290-977a-4434-bb93-036f314dd2df/parcels/${selectedParcelId}  `,
          {
            cabinet: {
              parcel: {
                parcel_status: 'in-transit',
              },
              driver_id: "9a543290-977a-4434-bb93-036f314dd2df",
            },
          },
            {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }  
        );

        //処理二個目　
        const response2 = await axios.patch(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/lockers/${lockerId}/cabinets/${cabinetsID}`,
          {
          },
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        
          
        console.log(response.data); 
        console.log(response2.data); 
       
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
        const isPending = cabinet?.parcel?.status === 'pending';

        arrangedCabinets.push(
          <div
            key={cabinetCount}
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              border: '1px solid black',
              textAlign: 'center',
              backgroundColor: isPending ? '#FFD500' : 'white',
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
