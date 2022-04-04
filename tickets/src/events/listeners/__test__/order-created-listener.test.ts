import {
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@kow-ticketing/common';
import { Types } from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: '123',
  });

  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'abc',
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message, ticket };
};

it('sets the orderId of the ticket', async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(data.ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, message, ticket } = await setup();

  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    Subjects.TicketUpdated,
    JSON.stringify({
      id: ticket.id,
      version: ticket.version + 1,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: data.id,
    }),
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][2],
  );
});
