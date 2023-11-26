import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface Parcel {
  id: string;
  sender: string;
  recipient: string;
  // Additional Parcel Information
}

interface CabinetDetails {
  id: string;
  size: string;
  status: string;
  parcels: Parcel[];
}

interface DeliverDetailProps {
  lockerId: string;
}

const DeliverDetail: React.FC<DeliverDetailProps> = ({ lockerId }) => {
  const { cabinetId } = useParams<{ cabinetId?: string }>();
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [doorClosed, setDoorClosed] = useState(false);

  // cabinetId が undefined の場合にデフォルトの値を設定する
  const cabinetDetails: CabinetDetails = {
    id: cabinetId || 'defaultCabinetId',
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

  const handleParcelSelection = (selectedParcel: Parcel) => {
    setSelectedParcel(selectedParcel);
  };

  const handleCloseDoor = () => {
    console.log('Door closed!');
    setDoorClosed(true);
  };

  return (
    <div>
      <h2>Locker {lockerId}</h2>
      <h2>Deliver Cabinet {cabinetDetails.id} Details</h2>

      {cabinetDetails.parcels.map((parcel, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '16px 0', backgroundColor: selectedParcel === parcel ? '#eee' : 'inherit' }}>
          <div style={{ flex: 1 }}>
            <h3>Parcel {index + 1} Details</h3>
            <p>ID: {parcel.id}</p>
            <p>Sender: {parcel.sender}</p>
            <p>Recipient: {parcel.recipient}</p>
          </div>
          <button onClick={() => handleParcelSelection(parcel)}>Select</button>
        </div>
      ))}

      {selectedParcel && !doorClosed && (
        <div>
          <h3>Selected Parcel Details</h3>
          <p>ID: {selectedParcel.id}</p>
          <p>Sender: {selectedParcel.sender}</p>
          <p>Recipient: {selectedParcel.recipient}</p>
        </div>
      )}

      {!doorClosed && <button onClick={handleCloseDoor}>Confirm and Close Door</button>}
    </div>
  );
};

export default DeliverDetail;
