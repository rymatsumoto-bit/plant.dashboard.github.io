export default function PlantTableRow({ plant, onClick }) {
  // Format the last activity date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Determine status badge styling based on plant health
  const getStatusBadge = () => {
    const status = plant.plant_status || 'unknown';
    const statusClass = status.toLowerCase().replace(' ', '-');
    
    return (
      <div className={`status-badge status-${statusClass}`}>
        {status}
      </div>
    );
  };

  return (
    <div 
      className="table-row" 
      data-plant-id={plant.plant_id}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div>
        <div className="plant-name">{plant.plant_name}</div>
        <div className="plant-species">{plant.species}</div>
      </div>
      <div>{plant.location_name || '-'}</div>
      <div>{getStatusBadge()}</div>
      <div>{formatDate(plant.last_activity_date)}</div>
      <div>
        <button 
          className="btn-icon"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click
            onClick();
          }}
          aria-label="View details"
        >
          →
        </button>
      </div>
    </div>
  );
}