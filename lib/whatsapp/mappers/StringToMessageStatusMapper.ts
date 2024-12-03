import {MessageStatus} from "@/lib/whatsapp/models/enum/MessageStatus";
import {WhapiMessageStatus} from "@/lib/whatsapp/models/enum/WhapiMessageStatus";

export class StringToMessageStatusMapper {
  map(status: string): MessageStatus {
    switch (status) {
      case WhapiMessageStatus.Pending.valueOf():
        return MessageStatus.Pending
      case WhapiMessageStatus.Sent.valueOf():
        return MessageStatus.Sent
      case WhapiMessageStatus.Delivered.valueOf():
        return MessageStatus.Delivered
      case WhapiMessageStatus.Read.valueOf():
        return MessageStatus.Read
      default:
        return MessageStatus.Failed
    }
  }
}