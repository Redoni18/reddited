"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../constants");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
let UserPasswordInput = class UserPasswordInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserPasswordInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserPasswordInput.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserPasswordInput.prototype, "email", void 0);
UserPasswordInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserPasswordInput);
let UserLoginInput = class UserLoginInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserLoginInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserLoginInput.prototype, "password", void 0);
UserLoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserLoginInput);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    async changePassword(token, newPassword, { redis, req }) {
        if (newPassword.length <= 8) {
            return {
                errors: [{
                        field: "password",
                        message: "password length must be greater than 8"
                    }]
            };
        }
        const key = 'Forgot_Password_Token: ' + token;
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [{
                        field: "token",
                        message: "token is invalid"
                    }]
            };
        }
        const userIdNum = parseInt(userId);
        const user = await User_1.User.findOne({ where: { id: userIdNum } });
        if (!user) {
            return {
                errors: [{
                        field: "token",
                        message: "user no longer exists"
                    }]
            };
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, constants_1.__saltRounds__);
        await User_1.User.update({ id: userIdNum }, { password: hashedPassword });
        await redis.del(key);
        req.session.userId = user.id;
        return { user };
    }
    async forgotPassword(email, { redis }) {
        const user = await User_1.User.findOne({ where: {
                email: email
            } });
        if (!user) {
            return true;
        }
        const token = (0, uuid_1.v4)();
        console.log(token);
        await redis.set(`Forgot_Password_Token: ${token}`, user.id);
        await redis.expire(`Forgot_Password_Token:${token}`, 3600 * 24 * 1);
        await (0, sendEmail_1.sendEmail)(email, `<p>In order to reset password <a href="http://localhost:3000/change-password/${token}">click here</a></p>`);
        return true;
    }
    async user({ req }) {
        if (!req.session.userId) {
            return null;
        }
        const user = await User_1.User.findOne({ where: { id: req.session.userId } });
        return user;
    }
    async register(options, { req }) {
        var _a;
        try {
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (options.username.length <= 2) {
                return {
                    errors: [{
                            field: "username",
                            message: "Username length must be greater than 2"
                        }]
                };
            }
            if (options.email.length <= 4) {
                return {
                    errors: [{
                            field: "email",
                            message: "Email length must be greater than 4 characters"
                        }]
                };
            }
            else if (!emailRegex.test(options.email)) {
                return {
                    errors: [{
                            field: "email",
                            message: "Please type a valid email"
                        }]
                };
            }
            if (options.password.length <= 8) {
                return {
                    errors: [{
                            field: "password",
                            message: "Password length must be greater than 8"
                        }]
                };
            }
            const hashedPassword = await bcrypt_1.default.hash(options.password, constants_1.__saltRounds__);
            const user = await User_1.User.create({
                username: options.username,
                email: options.email,
                password: hashedPassword
            }).save();
            req.session.userId = user.id;
            return { user };
        }
        catch (err) {
            if (err.code === "23505" || ((_a = err.detail) === null || _a === void 0 ? void 0 : _a.includes("already exists"))) {
                return {
                    errors: [{
                            field: "username",
                            message: `Username ${options.username} already exists`
                        }]
                };
            }
            return {
                errors: [{
                        field: "unknown",
                        message: "An error occurred during registration"
                    }]
            };
        }
    }
    async login(options, { req }) {
        const user = await User_1.User.findOne({ where: {
                email: options.email
            } });
        if (!user) {
            return {
                errors: [{
                        field: "email",
                        message: "email does not exist"
                    }]
            };
        }
        const validPassword = bcrypt_1.default.compareSync(options.password, user.password);
        if (!validPassword) {
            return {
                errors: [{
                        field: "password",
                        message: "Password is incorrect"
                    }]
            };
        }
        req.session.userId = user.id;
        return { user };
    }
    logout({ req, res }) {
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                if (err) {
                    resolve(false);
                    return;
                }
                res.clearCookie(constants_1.__cookieName__);
                resolve(true);
            });
        });
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('token')),
    __param(1, (0, type_graphql_1.Arg)('newPassword')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('options', () => UserPasswordInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserPasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('options', () => UserLoginInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserLoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
//# sourceMappingURL=user.js.map