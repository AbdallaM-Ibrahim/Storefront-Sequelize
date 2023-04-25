import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  DB_HOST,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME_TEST,
  ENV
} = process.env;

let Client: Pool;
console.log(`Current ENV: ${ENV}`);

if (ENV === 'dev') {
  Client = new Pool({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD
  });
} else if (ENV === 'test') {
  Client = new Pool({
    host: DB_HOST,
    database: DB_NAME_TEST,
    user: DB_USERNAME,
    password: DB_PASSWORD
  });
} else {
  throw new Error('Invalid environment');
}

export default Client;
