export declare class User {
    password: string;
    name: string;
    username: string;
    email: string;
    age: number;
}
export declare const UserModel: import("@typegoose/typegoose").ReturnModelType<typeof User, {}>;
