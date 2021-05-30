import request from 'supertest';
import { app } from '../../app';

//NOTE: SIGNUP TEST
it('return  a 201 on sucssesful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      name: 'Amir',
      email: 'test@test.com',
      password: '12345678999',
    })
    .expect(201);
});

it('returns a 400 with an invalid Email  on signup ', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Amir',
      email: 'testtest.com',
      password: '12345678999',
    })
    .expect(400);
});

it('returns a 400 with an invalid password on signup ', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Amir',
      email: 'test@test.com',
      password: '1',
    })
    .expect(400);
});

it('returns a 400 with an invalid  Name  on signup ', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '12345678999',
    })
    .expect(400);
});

it('returns a 400 with an missing password and Email and Name  on signup ', async () => {
  await request(app).post('/api/users/signup').send({}).expect(400);
});

it('disallowed dublication emails on signup ', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Amir',
      email: 'test@test.com',
      password: '12345678999',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Amir',
      email: 'test@test.com',
      password: '12345678999',
    })
    .expect(400);
});

it('set Cookie after sucssfully on signup', async () => {
  const cookie = await global.getAuthCookie();

  expect(cookie).toBeDefined();
});
//..........END of TEST  about SIGNUP.........
//NOTE: SIGNIN TEST............................
it('fails when a email that does not exist is supplied on signin', async () => {
  await request(app).post('/api/users/signin').send({}).expect(400);
});

it('fails when an incorrect  email on signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Amir',
      email: 'test@test.com',
      password: '12345678999',
    })
    .expect(201);

  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test2@test.com',
      password: '12345678999',
    })
    .expect(400);
});

it('responds  with cookie when given valid creditinnal  on signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Amir',
      email: 'test@test.com',
      password: '12345678999',
    })
    .expect(201);
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '12345678999',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
//............END of SIGNIN TEST.................
//NOTE:SIGNOUT...................................
it('clears the cookie after signout', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Amir',
      email: 'test@test.com',
      password: '12345678999',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
///END............................
//NOTE:CURRENT USER TEST ..............
it('current user', async () => {
  const cookie = await global.getAuthCookie();
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});
it('current user is null it means not autorizated', async () => {
  await request(app).get('/api/users/currentuser').send().expect(401);
});
