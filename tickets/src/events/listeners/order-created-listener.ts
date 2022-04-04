import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects,
} from '@kow-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent['data'],
    message: Message,
  ): Promise<void> {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket is found, throw error
    if (!ticket) throw new NotFoundError();

    // Mark the ticket as being reserved by settings its orderId property
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // Ack the message
    message.ack();
  }
}
