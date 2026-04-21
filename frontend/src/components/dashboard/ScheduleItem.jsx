// Individual Schedule Item Component
function ScheduleItem({ schedule }) {
  return (
    <div data-schedule-id={schedule.schedule_id} className="inline-flex p-4 bg-background-primary rounded-lg justify-between items-center cursor-pointer duration-300 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div 
          className="w-7 h-7 rounded-full
            [[severity='0']]:bg-success 
            [[severity='1']]:bg-attention 
            [[severity='2']]:bg-warning 
            [[severity='3']]:bg-danger"
          severity={schedule.schedule_severity}
        ></div>
        <div>
          <div className="font-medium text-sm">{schedule.plant_name}</div>
          <div className="text-xs text-font-light">{schedule.schedule_date}</div>
        </div>
      </div>
      <div
        className="text-white px-3.5 py-1.5 rounded-full text-sm font-medium uppercase"
        schedule-label={schedule.schedule_label}
        style={{
          backgroundColor: `var(--schedule-${schedule.schedule_label}, #cccccc)`
        }}
      >
        {schedule.schedule_label}
      </div>
    </div>
  );
}

export default ScheduleItem;