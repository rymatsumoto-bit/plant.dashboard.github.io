export default function AddressCard({ address, onClick }) {

  const handleDetailClick = (e) => {
    e.stopPropagation();
    onClick(plant.plant_id);
  };

  return (
    <div
      className="card card-address" 
      data-address-id={address.address_id}
      onClick={() => onClick(address.address_id)}
    >
      {/* Name + Highlights */}
      <div>
        <h2>{address.address_name || 'Unnamed Address'}</h2>
        
        <div className="card-address-image">
          <img
            src={`/assets/images/habitat-desert.jpg`}
            alt={address.address_id || 'address'}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/assets/images/icons/plants/default.svg';
            }}
          />
        </div>
        <div className="card-habitat-stat">
          <span>Lighting</span>
          <div className="card-habitat-stat-bar">
            <div className="card-habitat-stat-fill" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="card-habitat-stat">
          <span>Humidity</span>
          <div className="card-habitat-stat-bar">
            <div className="card-habitat-stat-fill" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="card-habitat-stat">
          <span>Temperature</span>
          <div className="card-habitat-stat-bar">
            <div className="card-habitat-stat-fill" style={{ width: '65%' }}></div>
          </div>
        </div>

        <br/>

        <div className="card-habitat-stat">
          <span>Plants</span>
          <div>45</div>
        </div>

      </div>
    </div>
  );
}