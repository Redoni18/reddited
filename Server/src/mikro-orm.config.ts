import { Options } from "@mikro-orm/postgresql"
import { Post } from "./entities/Post";
import { __dbPassword__, __prod__ } from "./constants";
import path from "path";

const config:Options = {
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    },
    entities: [Post],
    dbName: "reddit-db",
    type: "postgresql",
    debug: !__prod__,
    password: __dbPassword__,
    allowGlobalContext: true
}

export default config;