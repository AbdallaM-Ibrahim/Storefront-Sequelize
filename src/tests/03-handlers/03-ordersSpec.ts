import supertest from 'supertest';
import { Order } from '../../models/order';
import app from '../../server';
import { User } from '../../models/user';
import jwt, { Secret } from 'jsonwebtoken';
import { Product } from '../../models/product';
import { Order_Product } from '../../models/order_product';
import { config } from '../../config/config';
const request = supertest(app);

describe('orders handler', () => {
  let order: { id?: number; user_id: string; status: string };
  let order_data: Order;

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

  beforeAll(async () => {
    token = (await request.post('/users').send(user).expect(201)).body;
    user_data = (
      jwt.verify(token, config.token_secret as Secret) as Decoded_Token
    ).user;
    order = {
      user_id: user_data.id as unknown as string,
      status: 'active'
    };
  });

  afterAll(async () => {
    await request
      .delete(`/users/${user_data.id}`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(204);
  });

  it('should create order', async () => {
    const response = await request
      .post('/orders')
      .set({ Authorization: 'Bearer ' + token })
      .send(order)
      .expect(201);
    order_data = response.body;
    expect(order_data.id).not.toBeNull();
  });

  it('should get all orders', async () => {
    const response = await request
      .get('/orders')
      .set({ Authorization: 'Bearer ' + token })
      .expect(200);
    expect(response.body).toEqual([order_data]);
  });

  it('should get one order', async () => {
    const response = await request
      .get(`/orders/${order_data.id}`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(200);
    expect(response.body).toEqual(order_data);
  });

  describe('Products inside an order', () => {
    let order_product: {
      order_id: number;
      product_id: number;
      quantity: number;
    };

    const product = {
      name: 'John',
      price: 1050,
      category: 'perfume'
    };

    const user = {
      firstname: 'John',
      lastname: 'Wick',
      password: 'password123'
    };

    let product_data: Product;

    type Decoded_Token = {
      user: User;
      iat: number;
    };
    let token: string;
    let user_data: User;

    beforeAll(async () => {
      token = (await request.post('/users').send(user).expect(201)).body;
      user_data = (
        jwt.verify(token, config.token_secret as Secret) as Decoded_Token
      ).user;
      const response = await request
        .post('/products')
        .set({ Authorization: 'Bearer ' + token })
        .send(product)
        .expect(201);
      product_data = response.body;
      order_product = {
        order_id: order_data.id,
        product_id: product_data.id,
        quantity: 3
      };
    });

    afterAll(async () => {
      await request
        .delete(`/products/${product_data.id}`)
        .set({ Authorization: 'Bearer ' + token })
        .expect(204);
      await request
        .delete(`/users/${user_data.id}`)
        .set({ Authorization: 'Bearer ' + token })
        .expect(204);
    });

    it(`should get all order's products`, async () => {
      const response = await request
        .get(`/orders/${order_data.id}/products`)
        .set({ Authorization: 'Bearer ' + token })
        .expect(200);
      expect(response.body).toEqual([]);
    });

    it('should get add product to order', async () => {
      await request
        .post(`/orders/${order_data.id}/products`)
        .set({ Authorization: 'Bearer ' + token })
        .send(order_product)
        .expect(201);
      const order_products: Order_Product[] = (
        await request
          .get(`/orders/${order_data.id}/products`)
          .set({ Authorization: 'Bearer ' + token })
          .expect(200)
      ).body;
      expect(order_products[0].order_id).toEqual(order_product.order_id);
      expect(order_products[0].product_id).toEqual(order_product.product_id);
      expect(order_products[0].quantity).toEqual(order_product.quantity);
    });

    it('should remove product from order', async () => {
      await request
        .delete(`/orders/${order_data.id}/products/${order_product.product_id}`)
        .set({ Authorization: 'Bearer ' + token })
        .expect(200);
      const order_products: Order_Product[] = (
        await request
          .get(`/orders/${order_data.id}/products`)
          .set({ Authorization: 'Bearer ' + token })
          .expect(200)
      ).body;
      expect(order_products).toEqual([]);
    });
  });

  it('should get delete order', async () => {
    await request
      .delete(`/orders/${order_data.id}`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(204);
    const orders_in_db = (
      await request
        .get('/orders')
        .set({ Authorization: 'Bearer ' + token })
        .expect(200)
    ).body;
    expect(orders_in_db).toEqual([]);
  });
});
