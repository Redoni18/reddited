import { RequiredEntityData } from "@mikro-orm/core"
import { User } from "../entities/User"
import { MyContext } from "src/types"
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql"
import bcrypt from 'bcrypt';
import { __saltRounds__ } from "../constants";

@InputType()
class UserPasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async register(
        @Arg('options', () => UserPasswordInput) options: UserPasswordInput,
        @Ctx() { em }: MyContext
    ) {
        const hashedPassword = await bcrypt.hash(options.password, __saltRounds__)
        
        const user =  em.create(User, { username: options.username, password: hashedPassword } as RequiredEntityData<User>)
        await em.persistAndFlush(user)

        return user 
    }
}