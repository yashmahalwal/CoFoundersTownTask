import { ErrorType, Success } from "../api-types";
import { User } from "../Models/user";

export type UsernameAvailabilityPayload =
    | {
          available: boolean;
      }
    | ErrorType;

export type UserCreatePayload = Success | ErrorType;
export type UserLoginPayload = Success | ErrorType;
export type UserFetchPayload = { user: Omit<User, "password"> } | ErrorType;
export type ViewerPayload = { user: Omit<User, "password"> | null } | ErrorType;
export function isUser(user: unknown): user is User {
    if (!user || typeof user !== "object") return false;

    return (
        "name" in user &&
        typeof user["name"] === "string" &&
        user["name"].length > 0 &&
        "email" in user &&
        typeof user["email"] === "string" &&
        user["email"].length > 0 &&
        "username" in user &&
        typeof user["username"] === "string" &&
        user["username"].length > 0 &&
        "password" in user &&
        typeof user["password"] === "string" &&
        user["password"].length > 0 &&
        "age" in user &&
        typeof user["age"] === "number" &&
        user["age"] >= 0
    );
}
