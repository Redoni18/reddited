"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const constants_1 = require("./constants");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const body_parser_1 = require("body-parser");
const express4_1 = require("@apollo/server/express4");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const pg_1 = __importDefault(require("pg"));
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    orm.em.fork();
    const app = (0, express_1.default)();
    const cors = require('cors');
    const pgSession = (0, connect_pg_simple_1.default)(express_session_1.default);
    const pgPool = new pg_1.default.Pool({
        user: constants_1.__dbUser__,
        host: constants_1.__dbHost__,
        database: constants_1.__dbName__,
        password: constants_1.__dbPassword__,
        port: 5432,
    });
    app.use((0, express_session_1.default)({
        name: "qid",
        store: new pgSession({
            pool: pgPool,
            disableTouch: true,
            createTableIfMissing: true
        }),
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
        context: async ({ req, res }) => ({ em: orm.em, req, res }),
    }));
    app.listen(8000, () => {
        console.log('server started on port 8000');
    });
};
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map