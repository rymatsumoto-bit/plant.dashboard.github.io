import HabitatCard from './HabitatCard';

export default function HabitatList({ habitats, onHabitatClick }) {
  if (!habitats || habitats.length === 0) {
    return (
      <div className="card">
        <div>
          <div className="text-center p-5 text-font-light text-sm">No habitats.</div>
        </div>
      </div>
    );
  }

  return (
    <div id="habitat-list-cards" className="card-habitat-container">
      {habitats.map((habitat) => (
        <HabitatCard
          key={habitats.habitat_id}
          habitat={habitat}
          onClick={() => onHabitatClick(habitat.habitat_id)}
        />
      ))}
    </div>
  );
}