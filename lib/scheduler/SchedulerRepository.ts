export interface ScheduleTime {
  seconds?: number;
  minutes?: number;
  hours?: number;
  dayOfMonth?: number;
  month?: number;
  dayOfWeek?: number;
}


export interface SchedulerRepository {
  scheduleTask(id: string, time: ScheduleTime, task: () => void): void;
}