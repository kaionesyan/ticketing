import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signup: () => string[];
}

let mongo: MongoMemoryServer;

jest.mock('../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = 'fakekey';

  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = () => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object
  const session = { jwt: token };

  // Turn session into JSON
  const sessionJson = JSON.stringify(session);

  // Take JSON and encode it to base64
  const base64 = Buffer.from(sessionJson).toString('base64');

  // Return the base64 cookie
  return [`session=${base64}`];
};
