import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { UserEntity } from "../entity/user.entity";
import { BlackListedTokenEntity } from "../entity/blacklisted-token.entity";
import { CartEntity } from "../entity/cart.entity";
import { OrderEntity } from "../entity/order.entity";
import { ProductEntity } from "../entity/product.entity";
import { ReviewEntity } from "../entity/review.entity";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;
console.log(DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE)

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432"),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: true,
    logging: false,
    //entities: [__dirname + "/entity/*.ts"], // Use a wildcard for TypeScript files
    entities: [UserEntity, ProductEntity, CartEntity, OrderEntity, ReviewEntity, BlackListedTokenEntity],
    migrations: [__dirname + "/migration/*.ts"],
    subscribers: [],
})



/*
"scripts": {
      "watch": "tsc -w",
      "dev": "nodemon build/index.js",
      "start:dev": "concurrently \"tsc -w\" \"nodemon build/index.js\"",
      "build": "tsc",
      "start": "ts-node src/index.ts",
      "typeorm": "typeorm-ts-node-commonjs",
      "migration:generate-dev": "typeorm-ts-node-commonjs migration:generate -d src/database/data-source.ts",
      "migration:dev": "typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts"
   }



import { DataSourceOptions, createConnection } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "../entity/User";
import { Product } from "../entity/Product";

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  NODE_ENV,
} = process.env;

*/
