export default function PlantTableRow({ plant, onClick }) {

  const formatDate = (dateString) => {
    if (!dateString) return 'no activity';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    onClick(plant.plant_id);
  };

  return (
    <div
      className="table-row"
      data-plant-id={plant.plant_id}
      onClick={() => onClick(plant.plant_id)}
    >
      {/* Name + Species */}
      <div className="plant-name-cell">
        <div className="plant-name-icon">
          <img
            src={`assets/images/icons/plants/${plant.plant_icon}.svg`}
            alt={plant.plant_icon || 'plant'}
            className="plant-icon-svg"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'assets/images/icons/plants/default.svg';
            }}
          />
        </div>
        <div className="plant-name-text">
          <div className="name">{plant.plant_name || 'Unnamed Plant'}</div>
          <div className="species">{plant.species || 'Unknown Species'}</div>
        </div>
      </div>

      {/* Habitat */}
      <div>{plant.habitat || 'Habitat unknown'}</div>

      {/* Status icon with tooltip */}
      <div>
        <span className="status-icon">
          {plant.status_icon || '❓'}
          <div className="tooltip-text">{plant.status_label || 'unknown'}</div>
        </span>
      </div>

      {/* Last Activity */}
      <div className="plant-name-cell">
        <div className="plant-name-text">
          <div className="name">{formatDate(plant.last_activity_date)}</div>
          <div className="species">{plant.last_activity_label || '-'}</div>
        </div>
      </div>

      {/* Detail button */}
      <div className="plant-detail-btn" onClick={handleDetailClick}>
        <img src="assets/images/icons/nav-detail.svg" alt="detail" />
      </div>
    </div>
  );
}