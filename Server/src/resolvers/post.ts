import { Post } from "../entities/Post"
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql"

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts():Promise<Post[]> {
        return Post.find()
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id') id: number
    ): Promise<Post | null> {
        return Post.findOne({ where: {id}})
    }


    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string,
    ): Promise<Post> {
        return Post.create({title}).save()
    }

    @Mutation(() => Post)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, {nullable: true}) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne({ where: {id}})
        if(!post) return null
        
        if(typeof title !== undefined) {
            await Post.update({id}, {title})
        }

        return post
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
        try {
            await Post.delete(id)
        } catch {
            return false
        }

        return true
    }


}