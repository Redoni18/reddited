import { RequiredEntityData } from "@mikro-orm/core"
import { User } from "../entities/User"
import { MyContext } from "src/types"
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql"
import bcrypt from 'bcrypt';
import { __cookieName__, __saltRounds__ } from "../constants";

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

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if(options.username.length <= 2) {
            return {
                errors: [{
                    field: "username",
                    message: "username length must be greater than 2"
                }]
            }
        }

        if(options.email.length <= 4) {
            return {
                errors: [{
                    field: "email",
                    message: "email length must be greater than 4 characters"
                }]
            }
        } else {
            if(!emailRegex.test(options.email)) {
                return {
                    errors: [{
                        field: "email",
                        message: "please type a valid email"
                    }]
                }
            }
        }


        if(options.password.length <= 8) {
            return {
                errors: [{
                    field: "username",
                    message: "password length must be greater than 8"
                }]
            }
        }

        const hashedPassword = await bcrypt.hash(options.password, __saltRounds__)
        
        const user =  em.create(User, { username: options.username, email: options.email, password: hashedPassword } as RequiredEntityData<User>)
        
        await em.persistAndFlush(user)
        try {
        } catch (err) {
            if(err.code === "23505" || err.detail?.includes("already exists")) {
                return {
                    errors: [{
                        field: "Username",
                        message: `Username ${options.username} already exists`
                    }]
                }
            }
        }

        req.session!.userId = user.id

        return { user } 
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

