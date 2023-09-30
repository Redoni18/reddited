"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__saltRounds__ = exports.__dbPassword__ = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.__dbPassword__ = "redoni";
exports.__saltRounds__ = 10;
//# sourceMappingURL=constants.js.map