import {ValidateFunction} from "ajv";
import {ReminderNotificationRequest} from "@/lib/notifications/models/ReminderNotificationRequest";

export class IsReminderNotificationRequestDataUseCase {
  constructor(private readonly validator: ValidateFunction) {}

  execute(data: ReminderNotificationRequest): boolean {
    return this.validator(data);
  }
}