import { sequelize } from '../sequelize';
import { Model, DataTypes } from 'sequelize';
import { User } from './user';

export enum Status {
  active = 'active',
  complete = 'complete'
}

export class Order extends Model {
  public id!: number;
  public user_id!: number;
  public status!: Status;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    status: {
      type: new DataTypes.ENUM,
      values: Object.values(Status),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'orders',
    sequelize
  }
);

Order.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

export class Store {
  async index(): Promise<Order[]> {
    try {
      return await Order.findAll();
    } catch (err) {
      throw new Error(`Could not get orders, ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const order: Order =
        (await Order.findByPk(id)) ||
        (() => {
          throw new Error(`table returned null`);
        })();
      return order;
    } catch (err) {
      throw new Error(`Could not find order ${id}, ${err}`);
    }
  }

  async create(order: { user_id: number; status: Status }): Promise<Order> {
    try {
      return await Order.create(order);
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

  async update(
    id: number,
    order: { user_id: number; status: string }
  ): Promise<Order> {
    try {
      const oldOrder: Order = await this.show(id);
      return await oldOrder.update(order);
    } catch (err) {
      throw new Error(`Could not update order ${id}, ${err}`);
    }
  }
}
