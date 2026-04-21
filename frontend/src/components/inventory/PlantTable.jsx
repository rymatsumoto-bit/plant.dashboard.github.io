import PlantTableRow from './PlantTableRow';

export default function PlantTable({ plants, onPlantClick }) {
  if (!plants || plants.length === 0) {
    return (
      <div className="card">
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_0.5fr] px-6 py-5 bg-white font-semibold text-lg text-forest-deep">
          <div>Name</div>
          <div>Location</div>
          <div>Status</div>
          <div>Last Activity</div>
          <div></div>
        </div>
        <div id="plant-inventory-rows">
          <div className="text-center p-5 text-font-light text-sm">No plants.</div>
        </div>
      </div>
    );
  }

  return (
    <div id="plant-inventory-table" className="card">
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_0.5fr] px-6 py-5 bg-white font-semibold text-lg text-forest-deep">
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