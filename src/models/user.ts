import { sequelize } from '../sequelize';
import { Model, DataTypes } from 'sequelize';
import { config } from '../config/config';
import bcrypt from 'bcrypt';

export class User extends Model {
  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    firstname: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    lastname: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    password: {
      type: new DataTypes.STRING(256),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'users',
    sequelize
  }
);

export class Store {
  async index(): Promise<User[]> {
    const users = await User.findAll();
    return users;
  }

  async show(id: number): Promise<User> {
    try {
      const user: User =
        (await User.findByPk(id)) ||
        (() => {
          throw new Error(`table returned null`);
        })();
      return user;
    } catch (err) {
      throw new Error(`Could not find user ${id}, ${err}`);
    }
  }

  async create(user: {
    firstname: string;
    lastname: string;
    password: string;
  }): Promise<User> {
    try {
      const { pepper, salt_rounds } = config;
      user.password = bcrypt.hashSync(
        user.password + pepper,
        salt_rounds || 10
      );
      const newUser: User = await User.create(user);
      return newUser;
    } catch (err) {
      throw new Error(`Could not add new user ${user.firstname}, ${err}`);
    }
  }

  async authenticate(id: number, password: string): Promise<User | null> {
    try {
      const user: User = await this.show(id);
      const { pepper } = config;
      if (bcrypt.compareSync(password + pepper, user.password)) {
        return user;
      }
      return null;
    } catch (err) {
      throw new Error(`Could not authenticate user ${id}, ${err}`);
    }
  }

  async update(
    id: number,
    user: { firstname: string; lastname: string; password: string }
  ): Promise<User> {
    try {
      const userToUpdate = await this.show(id);
      return await userToUpdate.update(user);
    } catch (err) {
      throw new Error(`Could not update user ${id}, ${err}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const user: User = await this.show(id);
      await user.destroy();
      return true;
    } catch (err) {
      throw new Error(`Could not delete user ${id}, ${err}`);
    }
  }
}
