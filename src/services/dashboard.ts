import { Order } from '../models/order';
import { Product } from '../models/product';
import { Order_Product } from '../models/order_product';
import { sequelize } from '../sequelize';

export type PopularProduct = {
  product: Product;
  total: number;
};

export class DashboardQueries {
  async mostPopularProducts(): Promise<PopularProduct[]> {
    try {
      const products = (await Order_Product.findAll({
        attributes: [
          'product_id',
          [sequelize.col('Product.name'), 'product_name'],
          [sequelize.fn('SUM', sequelize.col('quantity')), 'total']
        ],
        include: [
          {
            model: Product,
            attributes: ['id', 'name']
          }
        ],
        group: ['Order_Product.product_id', 'Product.id'],
        order: [[sequelize.literal('total'), 'DESC']],
        limit: 5
      })) as unknown as PopularProduct[];
      return products;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async productsByCategory(category: string): Promise<Product[]> {
    try {
      const products: Product[] = await Product.findAll({
        where: {
          category: category
        }
      });
      return products;
    } catch (err) {
      throw new Error(
        `Could not get products with category ${category}. Error: ${err}`
      );
    }
  }

  async currentOrderByUser(user_id: string): Promise<Order> {
    try {
      const order: Order =
        (await Order.findOne({
          where: {
            user_id: user_id,
            status: 'active'
          }
        })) ||
        (() => {
          throw new Error(`table returned null`);
        })();
      return order;
    } catch (err) {
      throw new Error(
        `Could not get current order for user ${user_id}. Error: ${err}`
      );
    }
  }

  async compOrdersByUser(user_id: string): Promise<Order[]> {
    try {
      const orders: Order[] = await Order.findAll({
        where: {
          user_id: user_id,
          status: 'complete'
        }
      });
      return orders;
    } catch (err) {
      throw new Error(
        `Could not get completed orders for user ${user_id}. Error: ${err}`
      );
    }
  }
}
