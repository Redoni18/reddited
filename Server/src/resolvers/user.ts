import { RequiredEntityData } from "@mikro-orm/core"
import { User } from "src/entities/User"
import { MyContext } from "src/types"
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql"

@InputType()
class UserPasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@Resolver()
export class UserResolver {
    @Mutation(() => String)
    async register(
        @Arg('options', () => UserPasswordInput) options: UserPasswordInput,
        @Ctx() { em }: MyContext
    ) {
        const user =  em.create(User, { username: options.username } as RequiredEntityData<User>)
        await em.persistAndFlush(user)
    }
}