import { Publisher, Subjects, TicketCreatedEvent } from '@kow-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
