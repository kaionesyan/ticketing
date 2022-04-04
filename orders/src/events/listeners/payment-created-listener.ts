import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@kow-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;

  queueGroupName = queueGroupName;

  async onMessage(
    data: PaymentCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (data.stripeId) {
      order.status = OrderStatus.Complete;
    } else {
      order.status = OrderStatus.Cancelled;
    }

    await order.save();

    msg.ack();
  }
}

export { PaymentCreatedListener };
