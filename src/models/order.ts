import { sequelize } from '../sequelize';
import { Model, DataTypes } from 'sequelize';

export class Order extends Model {
  public id!: number;
  public user_id!: string;
  public status!: string;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    status: {
      type: new DataTypes.ENUM('active', 'complete'),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'orders',
    sequelize,
  }
);

export class Store {
  async index(): Promise<Order[]> {
    try {
      return (await Order.findAll());
    } catch (err) {
      throw new Error(`Could not get orders, ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const order: Order = await Order.findByPk(id) ||
        (() => { throw new Error(`table returned null`) })();
      return order;
    } catch (err) {
      throw new Error(`Could not find order ${id}, ${err}`);
    }
  }

  async create(order: { user_id: string; status: string; }): Promise<Order> {
    try {
      return (await Order.create(order));
    } catch (err) {
      throw new Error(`Could not add new order for ${order.user_id}, ${err}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const order: Order = await this.show(id);
      await order.destroy();
      return true;
    } catch (err) {
      throw new Error(`Could not delete order ${id}, ${err}`);
    }
  }

  async update(id: number, order: { user_id: string; status: string; }): Promise<Order> {
    try {
      const oldOrder: Order = await this.show(id);
      return (await oldOrder.update(order));
    } catch (err) {
      throw new Error(`Could not update order ${id}, ${err}`);
    }
  }
}