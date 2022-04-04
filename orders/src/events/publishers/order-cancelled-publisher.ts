import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@kow-ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
