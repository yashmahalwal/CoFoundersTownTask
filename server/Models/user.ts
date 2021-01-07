import { prop, getModelForClass } from "@typegoose/typegoose";
export class User {
    @prop({ required: true })
    password: string;
    @prop({ required: true })
    name: string;
    @prop({ index: true, unique: true })
    username: string;
    @prop({ required: true })
    email: string;
    @prop({ required: true })
    age: number;
}

export const UserModel = getModelForClass(User);
