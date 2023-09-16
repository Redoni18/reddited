"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
const User_1 = require("./entities/User");
const config = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}',
    },
    entities: [Post_1.Post, User_1.User],
    dbName: "reddit-db",
    type: "postgresql",
    debug: !constants_1.__prod__,
    password: constants_1.__dbPassword__,
    allowGlobalContext: true
};
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map