import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: `${process.env.ENV}`,
  driver: `${process.env.DB_DRIVER}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  host: `${process.env.DB_HOST}`,
  port: Number(process.env.PORT),
  db_port: Number(process.env.DB_PORT),
  bcrypt_password: `${process.env.BCRYPT_PASSWORD}`,
  salt_rounds: Number(process.env.SALT_ROUNDS),
  token_secret: `${process.env.TOKEN_SECRET}`,
  pepper: `${process.env.PEPPER}`
};

if (config.env === 'test') {
  config.database = `${process.env.DB_NAME_TEST}`;
  config.port = Number(process.env.PORT_TEST);
}
