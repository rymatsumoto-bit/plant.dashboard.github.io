// Reusable KPI Card Component
function KPICard({ title, metric, tagline, iconSrc }) {
  return (
    <div className="card-kpi">
      <div>
        <div className="card-kpi-title">{title}</div>
        <div className="card-kpi-metric">{metric}</div>
        <div className="card-kpi-tagline">{tagline}</div>
      </div>
      <div className="card-kpi-icon">
        <img src={iconSrc} alt={title} />
      </div>
    </div>
  );
}

export default KPICard;