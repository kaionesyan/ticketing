import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from '@kow-ticketing/common';

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

export { PaymentCreatedPublisher };
