import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import dashboardRoutes from './handlers/dashboard';
import { config } from './config/config';
import { sequelize } from './sequelize';
import { User } from './models/user';

const app: express.Application = express();

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  User.sync()

  app.listen(config.port, function () {
    console.log(`app running on port: ${config.port}`);
  });
}) ()

app.use(bodyParser.json());

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    req.method,
    req.url,
    'Token:' + Boolean(req.headers.authorization),
    'body:' + JSON.stringify(req.body),
  )
  next()
}
app.use(logger)

app.get('/', function (req: Request, res: Response): void {
  res.send('Hello World!');
});

userRoutes(app);
orderRoutes(app);
productRoutes(app);
dashboardRoutes(app);

export default app;