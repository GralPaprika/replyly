import {SchedulerRepository, ScheduleTime} from "@/lib/scheduler/SchedulerRepository";
import {Job, scheduleJob} from "node-schedule";

export class SchedulerRepositoryImpl implements SchedulerRepository {
  private tasks = new Map<string, Job>();

  scheduleTask(id: string, time: ScheduleTime, task: () => void) {
    const newJob = scheduleJob(id, { minute: time.minutes }, task);
    const job = this.tasks.get(id);
    if (job) {
      job.cancel();
    }
    this.tasks.set(id, newJob);
  }
}