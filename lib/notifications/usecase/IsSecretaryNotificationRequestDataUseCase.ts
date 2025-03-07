import {ValidateFunction} from "ajv";
import {SecretaryNotificationRequest} from "@/lib/notifications/models/SecretaryNotificationRequest";

export class IsSecretaryNotificationRequestDataUseCase {
  constructor(private readonly validator: ValidateFunction) {}

  execute(data: SecretaryNotificationRequest): boolean {
    return this.validator(data);
  }
}