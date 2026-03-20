import PlantTableRow from './PlantTableRow';

export default function PlantTable({ plants, onPlantClick }) {
  if (!plants || plants.length === 0) {
    return (
      <div className="table">
        <div className="table-header">
          <div>Name</div>
          <div>Location</div>
          <div>Status</div>
          <div>Last Activity</div>
          <div></div>
        </div>
        <div id="plant-inventory-rows">
          <div className="empty-state">No plants.</div>
        </div>
      </div>
    );
  }

  return (
    <div id="plant-inventory-table" className="table">
      <div className="table-header">
        <div>Name</div>
        <div>Location</div>
        <div>Status</div>
        <div>Last Activity</div>
        <div></div>
      </div>
      <div id="plant-inventory-rows">
        {plants.map((plant) => (
          <PlantTableRow
            key={plant.plant_id}
            plant={plant}
            onClick={() => onPlantClick(plant.plant_id)}
          />
        ))}
      </div>
    </div>
  );
}