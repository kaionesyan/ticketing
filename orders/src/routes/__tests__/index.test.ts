import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it('fetches orders for a particular user', async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const cookieOne = global.signup();
  const cookieTwo = global.signup();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookieOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const responseOne = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const responseTwo = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', cookieTwo)
    .send()
    .expect(200);

  expect(response.body).toEqual([responseOne.body, responseTwo.body]);
});
