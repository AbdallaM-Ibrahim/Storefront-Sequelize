import { sequelize } from '../sequelize';
import { Model, DataTypes } from 'sequelize';
import { Order } from './order';
import { Product } from './product';

export class Order_Product extends Model {
  public order_id!: number;
  public product_id!: number;
  public quantity!: number;
}

Order_Product.init(
  {
    order_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Order,
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
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

  async show(order_id: number, product_id: number): Promise<Order_Product> {
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
    order_id: number;
    product_id: number;
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

  async delete(order_id: number, product_id: number): Promise<boolean> {
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
    order_id: number,
    product_id: number,
    order_product: { order_id: number; product_id: number; quantity: number }
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

  async getByOrder(order_id: number): Promise<Order_Product[]> {
    try {
      return await Order_Product.findAll({ where: { order_id: order_id } });
    } catch (err) {
      throw new Error(`Could not get order_products, ${err}`);
    }
  }
}
