import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Parcel {
  id: string;
  sender: string;
  recipient: string;
  special_instructions: string;  
  sender_id: string;
  // Additional Parcel Information
}
/* 
interface CabinetDetails {
  id: string;
  size: string;
  status: string;
  parcels: Parcel[];

}
 */
interface DeliverDetailProps {
  lockerId: string;
}

const DeliverDetail: React.FC<DeliverDetailProps> = ({ lockerId }) => {
  const { cabinetId } = useParams<{ cabinetId?: string }>();
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [doorClosed, setDoorClosed] = useState(false);
  const selectedParcelRef = useRef<HTMLDivElement>(null);
  const [parcels, setParcels] = useState<Parcel[]>([]); 
  console.log('selectedSender:', selectedSender);


  useEffect(() => {
    // データを取得する関数
    const fetchData = async () => {
      try {
        const authTokenRow = document.cookie
          .split('; ')
          .find((row) => row.startsWith('_access_token_='));

        const authToken = authTokenRow ? authTokenRow.split('=')[1] : undefined;

        if (authToken) {
          console.log(authToken);
        } else {
          console.error('Access token not found in cookies.');
        }

        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/users/9a543290-977a-4434-bb93-036f314dd2df/parcels`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        setParcels(response.data);
        console.log('Parcels response:', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); 

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleParcelSelection = (selectedParcel: Parcel) => {
    setSelectedParcelId(selectedParcel.id);
    setSelectedSender(selectedParcel.sender_id);

    if (selectedParcelRef.current) {
      selectedParcelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  ////////////////////////////how to get access token from cookie///////////////////////////////
  const getAccessTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === '_access_token_') {
        return value;
      }
    }
    return null;
  };
  const accessToken = getAccessTokenFromCookie();


  //////////////////////////////////////////////

  const handleCloseDoor = async () => {
    try {
       // 1. get access token from cookie
       const authTokenRow = document.cookie
        .split('; ')
        .find(row => row.startsWith('_access_token_='));

      const authToken = authTokenRow ? authTokenRow.split('=')[1] : undefined;

        if (authToken) {
          console.log(authToken);
        } else {
          console.error('Access token not found in cookies.');
        }

       //1 for PATCH user route (with token)

      const lockerIdValue = lockerId;  
      const cabinetIdValue = cabinetId; 
      const parcelIdValue = selectedParcelId; 
      const senderId= selectedSender 


      const response = await axios.patch(

       //1 for PATCH user route (with token)
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/users/${senderId}/parcels/${parcelIdValue}`,
        {
            parcel: {
              parcel_status: 'ready-for-pickup',
            },
           
        },
          {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }  
      );

      //////////////////need more parcels belong to driver and test more!/////////////////////
       //2 for PATCH locker route 
      const response2 = await axios.patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/lockers/${lockerIdValue}/cabinets/${cabinetIdValue}`,
        {   parcelId: parcelIdValue,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }

       
      );
      console.log(response.data);
      console.log(response2.data);


      
      if (response.status === 200) {
        console.log('Door closed successfully!update parcel status to null');
        setDoorClosed(true);
      } else {
        console.error('Door closure failed:', response.data);
      }
    } catch (error) {
      console.error('Error closing door:', error);
    }

    console.log('Door closed!');
    setDoorClosed(true);
  };
  

  return (
    <div>
      <h2>Locker {lockerId}</h2>
      <h2>Select the parcel to cabinet {cabinetId} </h2>

      {parcels.map((parcel, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #ccc',
            padding: '16px 0',
            backgroundColor: selectedParcelId === parcel.id ? '#eee' : 'inherit',
          }}
        >
          <div style={{ flex: 1 }}>
            <h3> Details</h3>
            <p>ID: {parcel.id}</p>
            <p>Sender: {parcel.sender_id}</p>
            <p>instructions: {parcel.special_instructions}</p>
           
          </div>
          <button
              style={{ marginLeft: '30px', margin: '30px' }}  
              onClick={() => handleParcelSelection(parcel)}
            >
  Select
</button>
        </div>
      ))}

      {!doorClosed && (
        <button
          onClick={handleCloseDoor}
          style={{ background: '#870939', color: 'white', padding: '20px', marginTop: '30px', alignItems: 'center' }}
        >
          Confirm and Close Door
        </button>
      )}
    </div>
  );
};

export default DeliverDetail;
