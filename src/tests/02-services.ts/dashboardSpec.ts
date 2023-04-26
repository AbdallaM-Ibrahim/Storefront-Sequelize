import { Order, Status, Store as OrderDB } from '../../models/order';
import { Product, Store as ProductDB } from '../../models/product';
import { User, Store as UserDB } from '../../models/user';
import { PopularProduct, DashboardQueries } from '../../services/dashboard';
const dashboardQueries: DashboardQueries = new DashboardQueries();

describe('dashboard functionality', () => {
  describe('order dashboard', () => {
    const user = {
      firstname: 'John',
      lastname: 'Wick',
      password: 'some string'
    };
    let user_data: User;

    beforeAll(async () => {
      user_data = await new UserDB().create(user);
    });
    afterAll(async () => {
      await new UserDB().delete(user_data.id);
    });

    it('should get current order', async () => {
      const active_order: Order = await new OrderDB().create({
        user_id: user_data.id,
        status: Status.active
      });
      const current_order: Order = await dashboardQueries.currentOrderByUser(
        String(user_data.id)
      );
      expect(current_order.id).toEqual(active_order.id);
      expect(current_order.user_id).toEqual(active_order.user_id);
      expect(current_order.status).toEqual(active_order.status);
      await new OrderDB().delete(active_order.id);
    });
    it('should get all completed orders', async () => {
      const complete_order = await new OrderDB().create({
        user_id: user_data.id,
        status: Status.complete
      });
      const completed_orders: Order[] = await dashboardQueries.compOrdersByUser(
        String(user_data.id)
      );
      expect(completed_orders[0].id).toEqual(complete_order.id);
      expect(completed_orders[0].user_id).toEqual(complete_order.user_id);
      expect(completed_orders[0].status).toEqual(complete_order.status);
      await new OrderDB().delete(complete_order.id);
    });
  });

  describe('product dashboard', () => {
    const product = {
      name: 'laptop',
      price: 1050,
      category: 'electronics'
    };
    let product_data: Product;

    beforeAll(async () => {
      product_data = await new ProductDB().create(product);
      expect(product_data.id).not.toBeNull();
    });

    afterAll(async () => {
      await new ProductDB().delete(product_data.id);
      const products: Product[] = await new ProductDB().index();
      expect(products).toEqual([]);
    });

    it('should top 5 popular products', async () => {
      const allProds: PopularProduct[] =
        await dashboardQueries.mostPopularProducts();
      expect(allProds).toEqual([]);
    });

    it('should get product of specific category', async () => {
      const products: Product[] = await dashboardQueries.productsByCategory(
        'electronics'
      );
      expect(products[0].id).toEqual(product_data.id);
      expect(products[0].name).toEqual(product_data.name);
      expect(products[0].price).toEqual(product_data.price);
      expect(products[0].category).toEqual(product_data.category);
    });
  });
});
