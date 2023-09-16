"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const body_parser_1 = require("body-parser");
const express4_1 = require("@apollo/server/express4");
const post_1 = require("./resolvers/post");
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    orm.em.fork();
    const app = (0, express_1.default)();
    const cors = require('cors');
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [hello_1.HelloResolver, post_1.PostResolver],
        validate: false,
    });
    const apolloServer = new server_1.ApolloServer({
        schema
    });
    await apolloServer.start();
    app.use('/graphql', (0, body_parser_1.json)(), cors(), (0, express4_1.expressMiddleware)(apolloServer, {
        context: async () => ({ em: orm.em })
    }));
    app.listen(8000, () => {
        console.log('server started on port 8000');
    });
};
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map