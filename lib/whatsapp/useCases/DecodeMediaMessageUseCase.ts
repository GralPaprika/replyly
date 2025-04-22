import {downloadUsingEncLink, Payload} from "@/lib/util/decode";

export class DecodeMediaMessageUseCase {
  async execute(messagePayload: Payload, destinationPath: string): Promise<string> {
    return  await downloadUsingEncLink(messagePayload, destinationPath);
  }
}