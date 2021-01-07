import { UserModel } from "../Models/user";
import bcrypt from "bcrypt";

const salts = 10;

export async function createUser(
    name: string,
    username: string,
    age: number,
    email: string,
    plainTextPassword: string
): Promise<void> {
    await UserModel.create({
        name,
        username: username.toLowerCase(),
        age,
        email,
        password: await bcrypt.hash(plainTextPassword, salts),
    });
}
