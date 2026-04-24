// Schedule Item Card

import ScheduleItem from './ScheduleItem';

function ScheduleCard({ schedule }) {
  return (
    <div className="card p-6 h-160 flex flex-col">
        <h1 className="shrink-0">Schedule</h1>
        <div className="grid grid-cols-1 flex-1 min-h-0 gap-3 items-start overflow-y-auto overflow-x-hidden pr-2.5 scrollbar" id="dashboard-schedule-list">
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