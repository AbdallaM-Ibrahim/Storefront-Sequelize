import express, { Request, Response } from 'express'
import { Product, Store as ProductsDB } from '../models/product'
import { authToken } from '../middlewares/auth';

const productsDB = new ProductsDB()

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products: Product[] = await productsDB.index()
    res.json(products)
  } catch (err: unknown) {
    res.status(400)
    if (err instanceof Error)
      res.json(err?.message)
  }
}

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const product: Product = await productsDB.show(id)
    res.json(product)
  } catch (err: unknown) {
    res.status(400)
    if (err instanceof Error)
      res.json(err?.message)
  }
}

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    }

    const newProduct: Product = await productsDB.create(product)
    res.status(201).json(newProduct)
  } catch (err: unknown) {
    res.status(400)
    if (err instanceof Error)
      res.json(err?.message)
  }
}

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    if (!(await productsDB.delete(id)))
      (() => { throw new Error(`Could not delete product ${id}`) })();
    res.status(204).end();
  } catch (err: unknown) {
    res.status(400)
    if (err instanceof Error)
      res.json(err?.message)
  }
}

const orderRoutes = (app: express.Application): void => {
  app.get('/products', index)
  app.get('/products/:id', show)
  app.post('/products', authToken, create)
  app.delete('/products/:id', authToken, destroy)
}

export default orderRoutes