import supertest from 'supertest';
import { User } from '../../models/user';
import app from '../../server';
import jwt, { Secret } from 'jsonwebtoken';
import { config } from '../../config/config';
const request = supertest(app);

describe('users handler', () => {
  const user = {
    firstname: 'John',
    lastname: 'Wick',
    password: 'password123'
  };

  type Decoded_Token = {
    user: User;
    iat: number;
  };
  let token: string;
  let user_data: User;

  describe('create user route', async () => {
    it('should  return user token', async () => {
      const response = await request.post('/users').send(user).expect(201);
      token = response.body;
      user_data = (
        jwt.verify(token, config.token_secret as Secret) as Decoded_Token
      ).user;
    });
    it('expects created user', async () => {
      expect(user_data.id).not.toBeNull();
    });
  });

  it('should get all users', async () => {
    const response = await request
      .get('/users')
      .set({ Authorization: 'Bearer ' + token })
      .expect(200);
    expect(response.body as User[]).toEqual([user_data]);
  });

  it('should get one user', async () => {
    const response = await request
      .get(`/users/${user_data.id}`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(200);
    expect(response.body as User).toEqual(user_data);
  });

  it('should get delete user', async () => {
    await request
      .delete(`/users/${user_data.id}`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(204);
    const users_in_db = (
      await request
        .get('/users')
        .set({ Authorization: 'Bearer ' + token })
        .expect(200)
    ).body;
    expect(users_in_db).toEqual([]);
  });

  it(`should get user's current order`, async () => {
    const response = await request
      .get(`/users/${user_data.id}/current`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(400);
    expect(response.body).toEqual(
      `Could not get current order for user ${user_data.id}. Error: Error: table returned null`
    );
  });

  it(`should get all user's completed orders`, async () => {
    const response = await request
      .get(`/users/${user_data.id}/completed`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(200);
    expect(response.body).toEqual([]);
  });
});
