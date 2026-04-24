// Reusable KPI Card Component
function KPICard({ title, metric, tagline, iconSrc }) {
  return (
    <div className="card grid grid-cols-[1fr_2fr] gap-0 bg-background-primary rounded-2.5 shadow-md p-4">
      <div className="flex items-center min-w-20">
        <img className="w-full h-[80%] relative" src={iconSrc} alt={title} />
      </div>
      <div className="text-right">
        <div className="text-forest-teal text-xl">{title}</div>
        <div className="text-forest-teal text-4xl font-semibold p-0 mt-1.5 mb-1.5">{metric}</div>
        <div className="text-font-light">{tagline}</div>
      </div>
    </div>
  );
}

export default KPICard;