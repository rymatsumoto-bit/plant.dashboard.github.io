// ============================================
// ScheduleItem.jsx - Individual Schedule Item
// ============================================
// Uses useActivity to open the correct modal
// based on the schedule label (activity type).
// MARK AS DONE pre-fills both type and plantId.
// ============================================

import ScheduleItemDate from './ScheduleItemDate';
import { useActivity } from '../../context/ActivityContext';

function ScheduleItem({ schedule }) {
  const { openActivity } = useActivity();

  const handleMarkAsDone = () => {
    openActivity({
      activityType: schedule.schedule_label,
      plantId: schedule.plant_id,
    });
  };

  const handleDismiss = () => {
    // TODO: implement dismiss logic (close schedule item without logging activity)
    console.log('Dismiss schedule item:', schedule.schedule_id);
  };


  return (
    <div data-schedule-id={schedule.schedule_id} className="h-20 grid grid-cols-[1fr_1fr_8fr_4fr_4fr_4fr] p-4 bg-background-primary gap-8 rounded-lg justify-between items-center cursor-pointer duration-300 hover:shadow-sm">
        
      {/* schedule date */}
      <ScheduleItemDate schedule={schedule} />

      {/* severity pill */}
      <div 
        className="w-8 h-8 rounded-full flex items-center gap-3
          [[severity='0']]:bg-success 
          [[severity='1']]:bg-attention 
          [[severity='2']]:bg-warning 
          [[severity='3']]:bg-danger"
        severity={schedule.schedule_severity}
      ></div>

      {/* plant */}
      <div className="flex items-center gap-3 text-base text-forest-teal">{schedule.plant_name}</div>
      
      {/* type of schedule */}
      <div
        className="text-white px-3.5 py-1.5 rounded-full text-sm font-medium text-center uppercase"
        schedule-label={schedule.schedule_label}
        style={{
          backgroundColor: `var(--schedule-${schedule.schedule_label}, #cccccc)`
        }}
      >
        {schedule.schedule_label}
      </div>
      
      {/* DISMISS BUTTON */}
      <div
        className="btn px-3.5 py-1.5 rounded-full text-sm font-medium text-terracotta text-center uppercase bg-clay"
      >
        <button onClick={handleDismiss}>DISMISS</button>
      </div>

      {/* MARK COMPLETED */}
      <div
        className="btn px-3.5 py-1.5 rounded-full text-sm font-medium text-terracotta text-center uppercase bg-clay"
      >
        <button onClick={handleMarkAsDone}>✔️ MARK DONE</button>
      </div>

    </div>
  );
}

export default ScheduleItem;