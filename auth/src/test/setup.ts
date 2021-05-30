import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      getAuthCookie(): Promise<string[]>;
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.KEY_COOKIE = 'asdddaa';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getAuthCookie = async () => {
  const name = 'Amir';
  const email = 'test@test.com';
  const password = '12345678999';
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      name,
      email,
      password,
    })
    .expect(201);

  const cookies = response.get('Set-Cookie');
  return cookies;
};
