import 'reflect-metadata'
import { MikroORM } from "@mikro-orm/core";
import { __cookieName__, __dbHost__, __dbName__, __dbPassword__, __dbUser__, __prod__, __secret__ } from "./constants";
import microConfig from "./mikro-orm.config"
import express from "express"
import { ApolloServer } from "@apollo/server"
import { buildSchema } from "type-graphql"
import {GraphQLSchema } from "graphql"
import { HelloResolver } from "./resolvers/hello";
import { json } from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from './resolvers/user';
import session from "express-session"
import connectPgSimple from "connect-pg-simple"
import pg from "pg"
import { MyContext } from './types';

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up()

    orm.em.fork();

    const app = express();
    const cors = require('cors')

    const pgSession = connectPgSimple(session);

    const pgPool = new pg.Pool({
        user: __dbUser__,
        host: __dbHost__,
        database: __dbName__,
        password: __dbPassword__,
        port: 5432,
    });

    app.use(session({
        name: __cookieName__,
        store: new pgSession({
            pool : pgPool,
            disableTouch: true,
            createTableIfMissing: true
        }),
        secret: __secret__,
        resave: false,
        cookie: { 
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: __prod__, //cookie only works in https,
            sameSite: 'lax'
        }, // 30 days
        // Insert express-session options here
        saveUninitialized: false
    }));


    const schema:GraphQLSchema = await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false,
    })

    const apolloServer = new ApolloServer({
        schema,
    });

    await apolloServer.start();

    app.use(
        '/graphql',
        json(),
        cors({ 
            origin: ['http://localhost:3000'],
            credentials: true,
        }),
        expressMiddleware(apolloServer, {
            context: async ({ req, res }): Promise<MyContext> => ({ em: orm.em, req, res }),
        }),
    );


    app.listen(8000, () => {
        console.log('server started on port 8000')
    })
};

main().catch((err) => {
    console.error(err);
});
