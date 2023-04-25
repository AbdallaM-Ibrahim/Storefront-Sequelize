import { sequelize } from "../sequelize";
import { Model, DataTypes } from "sequelize";

export class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public category!: string;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    price: {
      type: new DataTypes.FLOAT,
      allowNull: false,
    },
    category: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "products",
    sequelize,
  }
);

export class Store {
  async index(): Promise<Product[]> {
    try {
      return (await Product.findAll());
    } catch (err) {
      throw new Error(`Could not get products, ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const product: Product = await Product.findByPk(id) ||
        (() => { throw new Error(`table returned null`) })();
      return product;
    } catch (err) {
      throw new Error(`Could not find product ${id}, ${err}`);
    }
  }

  async create(product: { name: string; price: number; category: string; }): Promise<Product> {
    try {
      return (await Product.create(product));
    } catch (err) {
      throw new Error(`Could not create product ${product.name}, ${err}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const product: Product = await this.show(id);
      await product.destroy();
      return true;
    } catch (err) {
      throw new Error(`Could not delete product ${id}, ${err}`);
    }
  }

  async update(id: number, product: { name: string; price: number; category: string; }): Promise<Product> {
    try {
      const updatedProduct: Product = await this.show(id);
      return (await updatedProduct.update(product));
    } catch (err) {
      throw new Error(`Could not update product ${id}, ${err}`);
    }
  }
}