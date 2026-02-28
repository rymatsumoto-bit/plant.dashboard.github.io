import ScheduleItem from './ScheduleItem';

function ScheduleCard({ schedule }) {
  return (
    <div className="card">
        <div className="chunk-container-single-column" id="dashboard-schedule-list">
            {schedule.length === 0 ? (
            <div className="empty-state">NO ITEMS</div>
            ) : (
            schedule.map((item) => (
                <ScheduleItem key={item.schedule_id} schedule={item} />
            ))
            )}
        </div>
    </div>
);
}

export default ScheduleCard;