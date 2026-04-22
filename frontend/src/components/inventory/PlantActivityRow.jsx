export default function PlantActivityRow({ activity }) {

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

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1.5fr_1.5fr] px-5 py-2 gap-x-4 items-center border-t border-clay duration-200 hover:bg-item-highlight" data-activity-id={activity.activity_id}>
      <div>{formatDate(activity.activity_date)}</div>
      <div
        className="text-white text-center text-base rounded-full font-light uppercase"
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