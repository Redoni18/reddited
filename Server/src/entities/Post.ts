import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post{
    @Field()
    @PrimaryKey()
    id!: number

    @Field()
    @Property({type: 'text'})
    title!: string;

    @Field(() => String)
    @Property({type: "datetime"})
    createdAt = new Date()


    @Field(() => String)
    @Property({ type: "datetime", onUpdate: () => new Date()})
    updatedAt = new Date()

}