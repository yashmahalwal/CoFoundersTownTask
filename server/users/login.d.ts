import { User } from "../Models/user";
import { Response } from "express";
export declare function login(username: string, password: string): Promise<boolean>;
export declare function createJWTCookie(username: string, res: Response, durationInSec?: number): Promise<void>;
export declare function getUserFromCookie(cookie: string): Promise<User | null>;
