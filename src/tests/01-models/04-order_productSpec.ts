import { Order_Product, Store as OP_DB } from '../../models/order_product';
import { Store as UserDB } from '../../models/user';
import { Store as OrderDB, Status } from '../../models/order';
import { Store as ProductDB } from '../../models/product';

const opDB = new OP_DB();

describe('order_product model', () => {
  const order_product = {
    order_id: 2,
    product_id: 2,
    quantity: 3
  };

  const user = {
    firstname: 'John',
    lastname: 'Wick',
    password: 'some string'
  };

  const order = {
    user_id: 3,
    status: Status.active
  };

  const product = {
    name: 'laptop',
    price: 1050,
    category: 'electronics'
  };

  beforeAll(async () => {
    await new UserDB().create(user);
    await new OrderDB().create(order);
    await new ProductDB().create(product);
  });

  afterAll(async () => {
    await new OrderDB().delete(2);
    await new UserDB().delete(3);
    await new ProductDB().delete(2);
  });

  it('should create new order_product', async () => {
    const newOrder_Product: Order_Product = await opDB.create(order_product);
    expect(newOrder_Product.order_id).toEqual(order_product.product_id);
    expect(newOrder_Product.product_id).toEqual(order_product.product_id);
    expect(newOrder_Product.quantity).toEqual(order_product.quantity);
  });

  it('should get all order_products', async () => {
    const order_products: Order_Product[] = await opDB.index();
    expect(order_products[0].order_id).toEqual(order_product.order_id);
    expect(order_products[0].product_id).toEqual(order_product.product_id);
    expect(order_products[0].quantity).toEqual(order_product.quantity);
  });

  it('should get one order_product', async () => {
    const order_product_1: Order_Product = await opDB.show(
      order_product.order_id,
      order_product.product_id
    );
    expect(order_product_1.order_id).toEqual(order_product.order_id);
    expect(order_product_1.product_id).toEqual(order_product.product_id);
    expect(order_product_1.quantity).toEqual(order_product.quantity);
  });

  it('should remove the order_product', async () => {
    await opDB.delete(order_product.order_id, order_product.product_id);
    const order_products: Order_Product[] = await opDB.index();
    expect(order_products).toEqual([]);
  });
});
