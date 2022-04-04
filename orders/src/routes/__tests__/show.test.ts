import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const cookie = global.signup();

  const {
    body: { id },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(id);
});

it('returns an error if the user does not own the order', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const cookie = global.signup();

  const {
    body: { id },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', global.signup())
    .send()
    .expect(401);
});
