export default function PlantTableRow({ plant, onClick }) {

  const formatDate = (dateString, locale = 'en-US') => {
    if (!dateString) return 'no activity';

    // Split YYYY-MM-DD and create a local date (not UTC)
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); 

    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    onClick(plant.plant_id);
  };

  return (
    <div
      className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_0.5fr] px-6 py-5 border-t border-clay items-center duration-200 hover:bg-item-highlight"
      data-plant-id={plant.plant_id}
      onClick={() => onClick(plant.plant_id)}
    >
      {/* Name + Species */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg">
          <img
            src={`assets/images/icons/plants/${plant.plant_icon}.svg`}
            alt={plant.plant_icon || 'plant'}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'assets/images/icons/plants/default.svg';
            }}
          />
        </div>
        <div>
          <div className="text-base font-semibold mb-0.5">{plant.plant_name || 'Unnamed Plant'}</div>
          <div className="text-sm text-font-light">{plant.species || 'Unknown Species'}</div>
        </div>
      </div>

      {/* Habitat */}
      <div>{plant.habitat || 'Habitat unknown'}</div>

      {/* Status icon with tooltip */}
      <div>
        <span className="group relative
              w-10 h-10 text-xl
              rounded-full
              bg-background-secondary
              inline-flex
              items-center
              justify-center
              cursor-pointer">
          {plant.status_icon || '❓'}
          <div className="w-30 bg-background-secondary text-forest-teal text-center py-1 rounded-full absolute z-1 bottom-[125%] left-1/2 -ml-15 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">{plant.status_label || 'unknown'}</div>
        </span>
      </div>

      {/* Last Activity */}
      <div className="flex items-center gap-3">
        <div>
          <div className="text-base mb-0.5">{formatDate(plant.last_activity_date)}</div>
          <div className="text-base text-font-light">{plant.last_activity_label || '-'}</div>
        </div>
      </div>

      {/* Detail button */}
      <div className="w-9 h-9 items-center cursor-pointer" onClick={handleDetailClick}>
        <img className="w-full h-full object-cover" src="assets/images/icons/nav-detail.svg" alt="detail" />
      </div>
    </div>
  );
}