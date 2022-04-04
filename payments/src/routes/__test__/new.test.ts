import { OrderStatus } from '@kow-ticketing/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { natsWrapper } from '../../nats-wrapper';
import { stripe } from '../../stripe';

it('returns a 404 if the order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signup())
    .send({
      token: 'some token',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 if the order belongs to another user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: 'another user',
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signup())
    .send({
      token: 'some token',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 if the order is cancelled', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = signup(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Cancelled,
    userId,
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'some token',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = signup(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId,
    version: 0,
  });

  await order.save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const payment = await Payment.findById(response.body.id);
  expect(payment).toBeDefined();
  expect(payment!.orderId).toEqual(order.id);
  expect(payment!.stripeId).toEqual(response.body.stripeId);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');

  expect(stripe.charges.create).toHaveBeenCalled();
});

it('publishes payment created events', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = signup(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId,
    version: 0,
  });

  await order.save();

  await request(app).post('/api/payments').set('Cookie', cookie).send({
    token: 'tok_visa',
    orderId: order.id,
  });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
