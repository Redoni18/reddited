import 'reflect-metadata'
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
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

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up()

    orm.em.fork();

    const app = express();
    const cors = require('cors')


    const schema:GraphQLSchema = await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false,
    })

    const apolloServer = new ApolloServer({
        schema
    });

    await apolloServer.start();

    app.use(
        '/graphql',
        json(),
        cors(),
        expressMiddleware(apolloServer, {
            context: async () => ({ em: orm.em })
        }),
    );


    app.listen(8000, () => {
        console.log('server started on port 8000')
    })
};

main().catch((err) => {
    console.error(err);
});
