import Client from '../database'
import { Order } from '../models/order';
import { Product } from '../models/product';

export class DashboardQueries {
  async mostPopularProducts(): Promise<Product[]> {
    try {
      const sql = 'SELECT p.*, SUM(op.quantity) FROM products AS p JOIN order_products AS op ON p.id=op.product_id GROUP BY op.product_id,p.id ORDER BY SUM(op.quantity) DESC LIMIT 5;';
      const conn = await Client.connect()

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`)
    }
  }
  
  async productsByCategory(category: string): Promise<Product[]> {
    try {
      const products: Product[] = await Product.findAll({
        where: {
          category: category
        }
      })
      return products;
    } catch (err) {
      throw new Error(`Could not get products with category ${category}. Error: ${err}`)
    }
  }

  async currentOrderByUser(user_id: string): Promise<Order> {
    try {
      const order: Order = await Order.findOne({
        where: {
          user_id: user_id,
          status: 'active'
        }
      }) || (() => { throw new Error(`table returned null`) })();
      return order;
    } catch (err) {
      throw new Error(`Could not get current order for user ${user_id}. Error: ${err}`)
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
      throw new Error(`Could not get completed orders for user ${user_id}. Error: ${err}`)
    }
  }
}