export default function HabitatCard({ habitat, onClick }) {

  const handleDetailClick = (e) => {
    e.stopPropagation();
    onClick(plant.plant_id);
  };

  return (
    <div
      className="card card-habitat" 
      data-habitat-id={habitat.habitat_id}
      onClick={() => onClick(habitat.habitat_id)}
    >
      {/* Name + Highlights */}
      <div>
        <h2>{habitat.habitat_name || 'Unnamed Habitat'}</h2>
        
        <div className="card-habitat-image">
          <img
            src={`/assets/images/habitat-desert.jpg`}
            alt={habitat.habitat_id || 'habitat'}
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