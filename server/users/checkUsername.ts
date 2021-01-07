import { UserModel } from "../Models/user";

export async function doesUsernameExist(username: string): Promise<boolean> {
    return (
        (await UserModel.countDocuments({
            username: username.toLowerCase(),
        })) !== 0
    );
}
