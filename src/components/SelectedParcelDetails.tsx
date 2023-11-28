import React from 'react';

interface ParcelDetailsProps {
  parcel: {
    id: string;
    sender: string;
    recipient: string;
  };
  onClose: () => void;
}

const SelectedParcelDetails: React.FC<ParcelDetailsProps> = ({ parcel, onClose }) => {
  return (
    <div>
      <h3>Selected Parcel Details</h3>
      <p>ID: {parcel.id}</p>
      <p>Sender: {parcel.sender}</p>
      <p>Recipient: {parcel.recipient}</p>
      <button onClick={onClose}>Close Parcel Details</button>
    </div>
  );
};

export default SelectedParcelDetails;
