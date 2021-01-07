import { ErrorType, Success } from "../api-types";
import { User } from "../Models/user";
export declare type UsernameAvailabilityPayload = {
    available: boolean;
} | ErrorType;
export declare type UserCreatePayload = Success | ErrorType;
export declare type UserLoginPayload = Success | ErrorType;
export declare type UserFetchPayload = {
    user: Omit<User, "password">;
} | ErrorType;
export declare type ViewerPayload = {
    user: Omit<User, "password"> | null;
} | ErrorType;
export declare function isUser(user: unknown): user is User;
