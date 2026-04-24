import { useMemo } from 'react';

const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric' });
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

function ScheduleItemDate({ schedule }) {
  const { schedule_date, schedule_id } = schedule;

  const { day, month } = useMemo(() => {
    if (!schedule_date) return { day: '0', month: 'N/A' };

    const [year, month, day] = schedule_date.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return {
      day: dayFormatter.format(date),
      month: monthFormatter.format(date),
    };
  }, [schedule_date]);

  return (
    <div data-schedule-id={schedule_id} className="grid grid-rows-2 items-center text-font-light text-center font-semibold">
      <div className="text-md leading-none">{day}</div>
      <div className="text-sm uppercase">{month}</div>
    </div>
  );
}

export default ScheduleItemDate;
