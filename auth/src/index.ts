import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting auth service...');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('App connected to the database');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
