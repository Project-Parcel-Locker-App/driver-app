import React from 'react';
import { useParams } from 'react-router-dom';

interface DeliverDetailProps {
  lockerId: string;
}

const DeliverDetail: React.FC<DeliverDetailProps> = ({ lockerId }) => {
  const { cabinetId } = useParams<{ cabinetId: string }>();

  // fake data
  const cabinetDetails = {
    id: cabinetId,
    size: 'Medium',
    status: 'in-use',
    parcel: {
      id: '123',
      sender: 'John Doe',
      recipient: 'Jane Doe',
      // other information
    },
  };

  
  const handleCloseDoor = () => {
    // add method to close door
    console.log('Door closed!');
  };

  return (
    <div>
      <h2>Locker {lockerId}</h2>
      <h2>Deliver Cabinet {cabinetDetails.id} Details</h2>
      {/*  <p>Size: {cabinetDetails.size}</p>
      <p>Status: {cabinetDetails.status}</p> */}
      {cabinetDetails.parcel && (
        <div>
          <h3>Parcel Details</h3>
          <p>ID: {cabinetDetails.parcel.id}</p>
          <p>Sender: {cabinetDetails.parcel.sender}</p>
          <p>Recipient: {cabinetDetails.parcel.recipient}</p>
          {/* add additional info */}
        </div>
      )}

      <button onClick={handleCloseDoor}>Confirm and Close Door</button>
    </div>
  );
};

export default DeliverDetail;
