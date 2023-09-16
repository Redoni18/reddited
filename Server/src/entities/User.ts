import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User{
    @Field()
    @PrimaryKey()
    id!: number

    @Field()
    @Property({type: 'text', unique: true})
    username!: string;

    @Property({type: 'text' })
    password!: string;


    @Field(() => String)
    @Property({type: "datetime"})
    createdAt = new Date()


    @Field(() => String)
    @Property({ type: "datetime", onUpdate: () => new Date()})
    updatedAt = new Date()

}