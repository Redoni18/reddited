import { RequiredEntityData } from "@mikro-orm/core"
import { User } from "../entities/User"
import { MyContext } from "src/types"
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql"
import bcrypt from 'bcrypt';
import { __cookieName__, __saltRounds__ } from "../constants";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid"

@InputType()
class UserPasswordInput {
    @Field()
    username: string
    @Field()
    password: string
    @Field()
    email: string
}

@InputType()
class UserLoginInput {
    @Field()
    email: string
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string

    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() {em, redis, req}: MyContext
    ):Promise<UserResponse> {
        if(newPassword.length <= 8) {
            return {
                errors: [{
                    field: "password",
                    message: "password length must be greater than 8"
                }]
            }
        }

        const userId = await redis.get('Forgot_Password_Token: '+token)
        if(!userId) {
            return {
                errors: [{
                    field: "token",
                    message: "token is invalid"
                }]
            }
        }
        
        const user = await em.findOne(User, {id: parseInt(userId)})

        if(!user) {
            return {
                errors: [{
                    field: "token",
                    message: "user no longer exists"
                }]
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, __saltRounds__)
        
        user.password = hashedPassword
        
        await em.persistAndFlush(user)

        req.session!.userId = user.id

        return { user }
    }


    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { em, redis }: MyContext
    ) {
        const user = await em.findOne(User, {
            email: email
        })

        if(!user) {
            return true
        }

        const token = v4()
        console.log(token)

        await redis.set(`Forgot_Password_Token: ${token}`, user.id)
        await redis.expire(`Forgot_Password_Token:${token}`, 3600 * 24 * 1)

        await sendEmail(email, `<p>In order to reset password <a href="http://localhost:3000/change-password/${token}">click here</a></p>`)
        return true
    }

    @Query(() => User, {nullable: true})
    async user(
       @Ctx() { req, em }: MyContext 
    ) {
        if(!req.session!.userId) {
            return null
        }

        const user = await em.findOne(User, {id: req.session!.userId})
        return user
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => UserPasswordInput) options: UserPasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
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
            } else if (!emailRegex.test(options.email)) {
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
    
            const hashedPassword = await bcrypt.hash(options.password, __saltRounds__);
    
            const user = em.create(User, {
                username: options.username,
                email: options.email,
                password: hashedPassword
            } as RequiredEntityData<User>);
    
            await em.persistAndFlush(user);
    
            req.session!.userId = user.id;
    
            return { user };
        } catch (err) {
            if (err.code === "23505" || err.detail?.includes("already exists")) {
                return {
                    errors: [{
                        field: "username",
                        message: `Username ${options.username} already exists`
                    }]
                };
            }
    
            // Add a generic error message for other unexpected errors
            return {
                errors: [{
                    field: "unknown",
                    message: "An error occurred during registration"
                }]
            };
        }
    }
    

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UserLoginInput) options: UserLoginInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {
            email: options.email
        })

        if(!user) {
            return {
                errors: [{
                    field: "email",
                    message: "email does not exist"
                }]
            }
        }

        const validPassword = bcrypt.compareSync(options.password, user.password)


        if(!validPassword) {
            return {
                errors: [{
                    field: "password",
                    message: "Password is incorrect"
                }]
            }
        }

        req.session!.userId = user.id

        return { user }
    }

    @Mutation(() => Boolean)
    logout (
        @Ctx() { req, res }: MyContext
    ) {
        return new Promise((resolve) => {
            req.session!.destroy((err) => {
                if(err) {
                    resolve(false)
                    return
                }
                
                res.clearCookie(__cookieName__)
                resolve(true)
            })
        })
    }
}

