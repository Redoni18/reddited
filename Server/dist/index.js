"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const body_parser_1 = require("body-parser");
const express4_1 = require("@apollo/server/express4");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const connect_redis_1 = __importDefault(require("connect-redis"));
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const typeorm_1 = require("typeorm");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const main = async () => {
    const typeormConnection = new typeorm_1.DataSource({
        type: "postgres",
        host: constants_1.__dbHost__,
        port: 5432,
        username: constants_1.__dbUser__,
        password: constants_1.__dbPassword__,
        database: constants_1.__dbName2__,
        synchronize: false,
        logging: true,
        entities: [Post_1.Post, User_1.User],
        migrations: [],
        migrationsTableName: "typeorm-migrations",
    });
    typeormConnection.initialize().then(() => {
    }).catch(err => console.log(err));
    const app = (0, express_1.default)();
    const cors = require('cors');
    let redis = new ioredis_1.default();
    redis.connect().catch(console.error);
    let redisStore = new connect_redis_1.default({
        client: redis,
        prefix: "session:",
        disableTouch: true,
        disableTTL: true
    });
    app.use((0, express_session_1.default)({
        name: constants_1.__cookieName__,
        store: redisStore,
        secret: constants_1.__secret__,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: constants_1.__prod__,
            sameSite: 'lax'
        },
        saveUninitialized: false
    }));
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
        validate: false,
    });
    const apolloServer = new server_1.ApolloServer({
        schema,
    });
    await apolloServer.start();
    app.use('/graphql', (0, body_parser_1.json)(), cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    }), (0, express4_1.expressMiddleware)(apolloServer, {
        context: async ({ req, res }) => ({ req, res, redis }),
    }));
    app.listen(8000, () => {
        console.log('server started on port 8000');
    });
};
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map