import React from 'react';
import { useParams } from 'react-router-dom';

interface DeliverDetailProps {
  lockerId: string;
}

const DeliverDetail: React.FC<DeliverDetailProps> = ({ lockerId }) => {
  const { cabinetId } = useParams<{ cabinetId: string }>();

  // Fake data for 7 parcels
  const cabinetDetails = {
    id: cabinetId,
    size: 'Medium',
    status: 'in-use',
    parcels: [
      {
        id: '123',
        sender: 'John Doe',
        recipient: 'Jane Doe',
        // Additional Parcel Information
      },
      {
        id: '124',
        sender: 'Alice',
        recipient: 'Bob',
        // Additional Parcel Information
      },
      {
        id: '125',
        sender: 'Charlie',
        recipient: 'David',
        // Additional Parcel Information
      },
      {
        id: '126',
        sender: 'Eve',
        recipient: 'Frank',
        // Additional Parcel Information
      },
      {
        id: '127',
        sender: 'Grace',
        recipient: 'Harry',
        // Additional Parcel Information
      },
      {
        id: '128',
        sender: 'Ivy',
        recipient: 'Jack',
        // Additional Parcel Information
      },
      {
        id: '129',
        sender: 'Katherine',
        recipient: 'Leo',
        // Additional Parcel Information
      },
    ],
  };

  const handleCloseDoor = () => {
    // add method to close door
    console.log('Door closed!');
  };

  return (
    <div>
      <h2>Locker {lockerId}</h2>
      <h2>Deliver Cabinet {cabinetDetails.id} Details</h2>
      {cabinetDetails.parcels && cabinetDetails.parcels.map((parcel, index) => (
        <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '16px 0' }}>
          <h3>Parcel {index + 1} Details</h3>
          <p>ID: {parcel.id}</p>
          <p>Sender: {parcel.sender}</p>
          <p>Recipient: {parcel.recipient}</p>
          {/* Add additional info */}
        </div>
      ))}

      <button onClick={handleCloseDoor}>Confirm and Close Door</button>
    </div>
  );
};

export default DeliverDetail;
