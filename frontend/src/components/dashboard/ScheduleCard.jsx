import ScheduleItem from './ScheduleItem';

function ScheduleCard({ schedule }) {
  return (
    <div className="card">
        <div className="grid grid-cols-1 gap-3 items-start max-h-120 overflow-y-auto overflow-x-hidden pr-2.5 scrollbar" id="dashboard-schedule-list">
            {schedule.length === 0 ? (
            <div className="text-center p-5 text-font-light text-sm">NO ITEMS</div>
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