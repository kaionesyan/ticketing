import { ExpirationCompleteEvent, Publisher, Subjects } from "@kow-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}