// Reusable KPI Card Component
function KPICardI({ title, metric, tagline, iconSrc }) {
  return (
    <div className="card grid grid-cols-[2fr_1fr] gap-0 bg-white rounded-2.5 shadow-md p-5">
      <div>
        <div className="text-forest-teal text-xl">{title}</div>
        <div className="text-forest-teal text-4xl font-semibold p-0 mt-1.5 mb-1.5">{metric}</div>
        <div className="text-font-light">{tagline}</div>
      </div>
      <div className="flex items-center" min-w-20>
        <img className="w-full h-full relative" src={iconSrc} alt={title} />
      </div>
    </div>
  );
}

export default KPICardI;