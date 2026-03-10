export default function PlantActivityRow({ activity }) {

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="table-activity-row" data-activity-id={activity.activity_id}>
      <div>{formatDate(activity.activity_date)}</div>
      <div
        className="table-activity-type-badge"
        style={{ background: activity.background_color }}
      >
        {activity.activity_label}
      </div>
      <div>{activity.quantifier ?? '-'}</div>
      <div>{activity.unit ?? '-'}</div>
      <div>{activity.notes ?? '-'}</div>
      <div>{activity.result ?? '-'}</div>
    </div>
  );
}