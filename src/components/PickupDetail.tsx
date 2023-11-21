import React from 'react';
import { useParams } from 'react-router-dom';

interface PickupDetailProps {
  lockerId: string;
}

const PickupDetail: React.FC<PickupDetailProps> = ({ lockerId }) => {
  const { cabinetId } = useParams<{ cabinetId: string }>();

  // 仮のデータ
  const cabinetDetails = {
    id: cabinetId,
    size: 'Medium',
    status: 'in-use',
    parcel: {
      id: '123',
      sender: 'John Doe',
      recipient: 'Jane Doe',
      // 他の詳細情報も追加
    },
  };

  // 扉を閉じるボタンがクリックされたときの処理
  const handleCloseDoor = () => {
    // ここに扉を閉じるための処理を追加
    console.log('Door closed!');
  };

  return (
    <div>
      <h2>Locker {lockerId}</h2>
      <h2>Pickup Cabinet {cabinetDetails.id} Details</h2>
      {/*  <p>Size: {cabinetDetails.size}</p>
      <p>Status: {cabinetDetails.status}</p> */}
      {cabinetDetails.parcel && (
        <div>
          <h3>Parcel Details</h3>
          <p>ID: {cabinetDetails.parcel.id}</p>
          <p>Sender: {cabinetDetails.parcel.sender}</p>
          <p>Recipient: {cabinetDetails.parcel.recipient}</p>
          {/* 他のパーセルの詳細情報も表示できるように適宜追加 */}
        </div>
      )}
      {/* 確認して扉を閉じるボタン */}
      <button onClick={handleCloseDoor}>Confirm and Close Door</button>
    </div>
  );
};

export default PickupDetail;
