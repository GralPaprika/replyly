export interface Status {
  id: string;
  code: number;
  status: string;
  recipient_id: string;
  timestamp: string;
}

export interface Event {
  // @ts-ignore this is marked as error WebStorm because in TS type is also a keyword, but my investigation suggest that
  // it's not a problem at compile time:
  // https://stackoverflow.com/questions/66668209/use-class-names-to-define-properties-in-a-type
  type: string;
  event: string;
}

export interface MessageSentNotificationWebhookSchema {
  statuses: Status[];
  event: Event;
  channel_id: string;
}