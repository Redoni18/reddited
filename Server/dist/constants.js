"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__dbName__ = exports.__dbUser__ = exports.__dbHost__ = exports.__secret__ = exports.__saltRounds__ = exports.__dbPassword__ = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.__dbPassword__ = "redoni";
exports.__saltRounds__ = 10;
exports.__secret__ = "myverysecretsecret";
exports.__dbHost__ = "localhost";
exports.__dbUser__ = "postgres";
exports.__dbName__ = "reddit-db";
//# sourceMappingURL=constants.js.map