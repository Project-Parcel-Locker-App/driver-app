import React from 'react';
import { useParams } from 'react-router-dom';

interface PickupDetailProps {
  lockerId: string;
}

const PickupDetail: React.FC<PickupDetailProps> = ({ lockerId }) => {
  const { cabinetId } = useParams<{ cabinetId: string }>();


  

  // cabinetIdを元に、該当するボックスの詳細情報を取得する処理を追加
  // 例えば、Axiosを使用してサーバーからデータを取得するなど

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
    </div>
  );
};

export default PickupDetail;
