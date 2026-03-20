// Individual Schedule Item Component
function ScheduleItem({ schedule }) {
  return (
    <div data-schedule-id={schedule.schedule_id} className="dash-schedule-item">
      <div className="dash-schedule-plant">
        <div 
          className="dash-schedule-plant-icon" 
          severity={schedule.schedule_severity}
        ></div>
        <div className="dash-schedule-plant-info">
          <div className="name">{schedule.plant_name}</div>
          <div className="date">{schedule.schedule_date}</div>
        </div>
      </div>
      <div
        className="dash-schedule-badge"
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