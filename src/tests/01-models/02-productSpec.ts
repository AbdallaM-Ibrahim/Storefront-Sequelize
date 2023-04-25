import { Product, Store as ProductDB } from '../../models/product';
const productDB: ProductDB = new ProductDB();

describe("product model", () => {
  const prod = {
    name: "laptop",
    price: 1050,
    category: "electronics",
  }

  it("should create new product", async () => {
    const newProd: Product = await productDB.create(prod);
    expect(newProd.id).toBeTruthy();
  })

  it("should get all products", async () => {
    const allProds: Product[] = await productDB.index();
    expect(allProds[0].id).toEqual(1);
    expect(allProds[0].name).toEqual(prod.name);
    expect(allProds[0].price).toEqual(prod.price);
    expect(allProds[0].category).toEqual(prod.category);
  })

  it('should get one product', async () => {
    const prod_1: Product = await productDB.show(1);
    expect(prod_1.id).toEqual(1);
    expect(prod_1.name).toEqual(prod.name);
    expect(prod_1.price).toEqual(prod.price);
    expect(prod_1.category).toEqual(prod.category);
  })
  
  it('should remove the product', async () => {
    await productDB.delete(1);
    const products: Product[] = await productDB.index();
    expect(products).toEqual([]);
  })
})