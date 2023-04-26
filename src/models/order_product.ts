import { sequelize } from '../sequelize';
import { Model, DataTypes } from 'sequelize';
import { Order } from './order';
import { Product } from './product';

export class Order_Product extends Model {
  public order_id!: string;
  public product_id!: string;
  public quantity!: number;
}

Order_Product.init(
  {
    order_id: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
      references: {
        model: Order,
        key: 'id'
      }
    },
    product_id: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
      references: {
        model: Product,
        key: 'id'
      }
    },
    quantity: {
      type: new DataTypes.INTEGER(),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'order_products',
    sequelize
  }
);

Order_Product.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Order_Product, { foreignKey: 'product_id' });
Order_Product.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Order_Product, { foreignKey: 'order_id' });

export class Store {
  async index(): Promise<Order_Product[]> {
    try {
      return await Order_Product.findAll();
    } catch (err) {
      throw new Error(`Could not get order_products, ${err}`);
    }
  }

  async show(order_id: string, product_id: string): Promise<Order_Product> {
    try {
      const order_product: Order_Product =
        (await Order_Product.findOne({
          where: {
            order_id: order_id,
            product_id: product_id
          }
        })) ||
        (() => {
          throw new Error(`table returned null`);
        })();
      return order_product;
    } catch (err) {
      throw new Error(
        `Could not find order_product ${order_id}, ${product_id}, ${err}`
      );
    }
  }

  async create(order_product: {
    order_id: string;
    product_id: string;
    quantity: number;
  }): Promise<Order_Product> {
    try {
      return await Order_Product.create(order_product);
    } catch (err) {
      throw new Error(
        `Could not add order_product ${order_product.order_id}, ${order_product.product_id}, ${err}`
      );
    }
  }

  async delete(order_id: string, product_id: string): Promise<boolean> {
    try {
      const order_product: Order_Product = await this.show(
        order_id,
        product_id
      );
      await order_product.destroy();
      return true;
    } catch (err) {
      throw new Error(
        `Could not delete order_product ${order_id}, ${product_id}, ${err}`
      );
    }
  }

  async update(
    order_id: string,
    product_id: string,
    order_product: { order_id: string; product_id: string; quantity: number }
  ): Promise<Order_Product> {
    try {
      const order_product_to_update: Order_Product = await this.show(
        order_id,
        product_id
      );
      return await order_product_to_update.update(order_product);
    } catch (err) {
      throw new Error(
        `Could not update order_product ${order_id}, ${product_id}, ${err}`
      );
    }
  }

  async getByOrder(order_id: string): Promise<Order_Product[]> {
    try {
      return await Order_Product.findAll({ where: { order_id: order_id } });
    } catch (err) {
      throw new Error(`Could not get order_products, ${err}`);
    }
  }
}

// import Client from '../database'

// export type Order_Product = {
//   order_id: string;
//   product_id: string;
//   quantity: number;
// }

// export class Store {
//   async index(): Promise<Order_Product[]> {
//     try {
//       const conn = await Client.connect()
//       const sql = 'SELECT * FROM order_products'

//       const result = await conn.query(sql)

//       conn.release()

//       return result.rows
//     } catch (err) {
//       throw new Error(`Could not get order_products. Error: ${err}`)
//     }
//   }

//   async show(order_id: string, product_id: string): Promise<Order_Product> {
//     try {
//       const sql = 'SELECT * FROM order_products WHERE order_id=($1) AND product_id=($2)'
//       const conn = await Client.connect()

//       const result = await conn.query(sql, [order_id, product_id])

//       conn.release()

//       return result.rows[0]
//     } catch (err) {
//       throw new Error(`Could not find product ${product_id} inside order ${order_id}. Error: ${err}`)
//     }
//   }

//   async create(op: Order_Product): Promise<Order_Product> {
//     try {
//       const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *'
//       const conn = await Client.connect()
//       const result = await conn
//         .query(sql, [op.order_id, op.product_id, op.quantity])

//       const order_product: Order_Product = result.rows[0]

//       conn.release()

//       return order_product
//     } catch (err) {
//       throw new Error(`Could not add product ${op.product_id} to order ${op.order_id}. Error: ${err}`)
//     }
//   }

//   async delete(order_id: string, product_id:string): Promise<Order_Product> {
//     try {
//       const sql = 'DELETE FROM order_products WHERE order_id=($1) AND product_id=($2) RETURNING *'
//       const conn = await Client.connect()

//       const result = await conn.query(sql, [order_id, product_id])

//       const order_product: Order_Product = result.rows[0]

//       conn.release()

//       return order_product
//     } catch (err) {
//       throw new Error(`Could not delete order_product ${product_id} from order ${order_id}. Error: ${err}`)
//     }
//   }

//   async getByOrder(order_id: string): Promise<Order_Product[]> {
//     try {
//       const sql = 'SELECT * FROM order_products WHERE order_id=($1)'
//       const conn = await Client.connect()

//       const result = await conn.query(sql, [order_id])

//       conn.release()

//       return result.rows
//     } catch (err) {
//       throw new Error(`Could not find products inside order ${order_id}. Error: ${err}`)
//     }
//   }
// }
