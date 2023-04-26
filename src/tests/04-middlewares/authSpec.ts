import supertest from 'supertest';
import { User } from '../../models/user';
import app from '../../server';
import jwt, { Secret } from 'jsonwebtoken';
import { config } from '../../config/config';
const request = supertest(app);

describe('token authorization', () => {
  const user = {
    firstname: 'John',
    lastname: 'Wick',
    password: 'password123'
  };

  type Decoded_Token = {
    user?: User;
    iat?: number;
  };

  let token: string;
  let token_payload: Decoded_Token = {};

  beforeAll(async () => {
    const response = await request.post('/users').send(user).expect(201);
    token = response.body;
    token_payload = jwt.verify(
      token,
      config.token_secret as Secret
    ) as Decoded_Token;
  });

  afterAll(async () => {
    await request
      .delete(`/users/${token_payload.user?.id}`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(204);
  });

  it('should require token', async () => {
    await request.get('/users').expect(401);

    await request
      .get('/users')
      .set({ Authorization: 'Bearer ' + token })
      .expect(200);
  });
});
