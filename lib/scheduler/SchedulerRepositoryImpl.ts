import {SchedulerRepository, ScheduleTime} from "@/lib/scheduler/SchedulerRepository";
import {Job, scheduleJob} from "node-schedule";

export class SchedulerRepositoryImpl implements SchedulerRepository {
  private tasks = new Map<string, Job>();

  scheduleTask(id: string, time: ScheduleTime, task: () => void) {
    const newJob = scheduleJob(this.timeToString(time), task);
    const job = this.tasks.get(id);
    if (job) {
      job.cancel();
    }
    this.tasks.set(id, newJob);
  }

  private timeToString(time: ScheduleTime): string {
    console.log(time);
    const string = `${time.seconds ?? '*'} ${time.minutes ?? '*'} ${time.hours ?? '*'} ${time.dayOfMonth ?? '*'} ${time.month ?? '*'} ${time.dayOfWeek ?? ''}`;
    console.log(string);
    return string;
  }
}