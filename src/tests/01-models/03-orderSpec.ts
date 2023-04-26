import { Order, Status, Store as OrderDB } from '../../models/order';
import { Store as UserDB } from '../../models/user';

const orderDB: OrderDB = new OrderDB();

describe('order model', () => {
  const user = {
    firstname: 'John',
    lastname: 'Wick',
    password: 'some string'
  };

  const order = {
    user_id: 2,
    status: Status.active
  };

  beforeAll(async () => {
    await new UserDB().create(user);
  });

  afterAll(async () => {
    await new UserDB().delete(2);
  });

  it('should create new order', async () => {
    const newOrder: Order = await orderDB.create(order);
    expect(newOrder.id).toBeTruthy();
  });

  it('should get all orders', async () => {
    const orders: Order[] = await orderDB.index();
    expect(orders[0].id).toEqual(1);
    expect(orders[0].user_id).toEqual(order.user_id);
    expect(orders[0].status).toEqual(order.status);
  });

  it('should get one order', async () => {
    const order_1: Order = await orderDB.show(1);
    expect(order_1.id).toEqual(1);
    expect(order_1.user_id).toEqual(order.user_id);
    expect(order_1.status).toEqual(order.status);
  });

  it('should remove the order', async () => {
    await orderDB.delete(1);
    const orders: Order[] = await orderDB.index();
    expect(orders).toEqual([]);
  });
});
