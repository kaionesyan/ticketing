import { Publisher, Subjects, TicketUpdatedEvent } from '@kow-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
