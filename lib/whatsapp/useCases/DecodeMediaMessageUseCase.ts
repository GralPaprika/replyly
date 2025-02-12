import {downloadUsingEncLink, Payload} from "@/lib/util/decode";

export class DecodeMediaMessageUseCase {
  async execute(messagePayload: Payload): Promise<string> {
    return await downloadUsingEncLink(messagePayload);
  }
}