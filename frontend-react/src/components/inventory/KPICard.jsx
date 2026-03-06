export default function KPICard({ title, value, tagline, icon, iconAlt }) {
  return (
    <div className="card-kpi">
      <div>
        <div className="card-kpi-title">{title}</div>
        <div className="card-kpi-metric">{value}</div>
        <div className="card-kpi-tagline">{tagline}</div>
      </div>
      <div className="card-kpi-icon">
        <img src={icon} alt={iconAlt} />
      </div>
    </div>
  );
}