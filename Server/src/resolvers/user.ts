import { RequiredEntityData } from "@mikro-orm/core"
import { User } from "../entities/User"
import { MyContext } from "src/types"
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql"
import bcrypt from 'bcrypt';
import { __saltRounds__ } from "../constants";

@InputType()
class UserPasswordInput {
    @Field()
    username: string
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
    async register(
        @Arg('options', () => UserPasswordInput) options: UserPasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        if(options.username.length <= 2) {
            return {
                errors: [{
                    field: "username",
                    message: "username length must be greater than 2"
                }]
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
        
        const user =  em.create(User, { username: options.username, password: hashedPassword } as RequiredEntityData<User>)
        
        try {
            await em.persistAndFlush(user)
        } catch (err) {
            if(err.code === "23505" || err.detail.includes("already exists")) {
                return {
                    errors: [{
                        field: "Username",
                        message: `Username ${options.username} already exists`
                    }]
                }
            }
        }

        return { user } 
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UserPasswordInput) options: UserPasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {
            username: options.username
        })

        if(!user) {
            return {
                errors: [{
                    field: "username",
                    message: "Username does not exist"
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

        return { user }
    }
}

