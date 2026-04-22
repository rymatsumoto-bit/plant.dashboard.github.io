export default function HabitatCard({ habitat, onClick }) {

  const handleDetailClick = (e) => {
    e.stopPropagation();
    onClick(plant.plant_id);
  };

  return (
    <div
      className="card w-70 h-90 shrink p-4 transition-all duration-200 ease-in-out hover:translate-x-0.5 hover:translate-y-1 hover:shadow-lg" 
      data-habitat-id={habitat.habitat_id}
      onClick={() => onClick(habitat.habitat_id)}
    >
      {/* Name + Highlights */}
      <div>
        <h2>{habitat.habitat_name || 'Unnamed Habitat'}</h2>
        
        <div className="w-60 h-30 block items-center justify-center mt-4 mb-5 mx-auto">
          <img
            src={`assets/images/habitat-desert.jpg`}
            alt={habitat.habitat_id || 'habitat'}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'assets/images/icons/plants/default.svg';
            }}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-moss mt-1 justify-between">
          <span>Lighting</span>
          <div className="h-2 w-30 rounded-xl bg-sand overflow-hidden">
            <div className="h-full rounded-xl bg-[linear-gradient(90deg,var(--color-sage),var(--color-sunlight))]" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-moss mt-1 justify-between">
          <span>Humidity</span>
          <div className="h-2 w-30 rounded-xl bg-sand overflow-hidden">
            <div className="h-full rounded-xl bg-[linear-gradient(90deg,var(--color-sage),var(--color-sunlight))]" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-moss mt-1 justify-between">
          <span>Temperature</span>
          <div className="h-2 w-30 rounded-xl bg-sand overflow-hidden">
            <div className="h-full rounded-xl bg-[linear-gradient(90deg,var(--color-sage),var(--color-sunlight))]" style={{ width: '65%' }}></div>
          </div>
        </div>

        <br/>

        <div className="flex items-center gap-2 text-sm text-moss mt-1 justify-between">
          <span>Plants</span>
          <div>45</div>
        </div>

      </div>
    </div>
  );
}