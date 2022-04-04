import { OrderCreatedEvent, Publisher, Subjects } from '@kow-ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
