import 'reflect-metadata'
import { DataSource } from "typeorm";
import { __dbHost__, __dbName__, __dbPassword__, __dbUser__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import * as path from 'path';

export default new DataSource({
    type: "postgres",
    host: __dbHost__,
    port: 5432,
    username: __dbUser__,
    password: __dbPassword__,
    database: __dbName__,
    synchronize: false,
    logging: true,
    entities: [Post, User],
    migrations: [path.join(__dirname, "./migrations/*")]
});