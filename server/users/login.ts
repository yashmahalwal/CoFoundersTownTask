import jwt from "jsonwebtoken";
import { User, UserModel } from "../Models/user";
import bcrypt from "bcrypt";
import { Response } from "express";

export async function login(
    username: string,
    password: string
): Promise<boolean> {
    const user = await UserModel.findOne({ username });
    if (!user) return false;

    const storedPassword = user.password;
    return await bcrypt.compare(password, storedPassword);
}

export async function createJWTCookie(
    username: string,
    res: Response,
    durationInSec?: number
): Promise<void> {
    const opts: jwt.SignOptions = {};

    if (durationInSec) opts.expiresIn = durationInSec;

    const tokenPromise = new Promise<string>((resolve, reject) => {
        jwt.sign({ username }, process.env.JWT_SECRET, opts, (err, token) => {
            if (err) reject(err);
            else resolve(token);
        });
    });

    res.cookie("token", await tokenPromise, {
        expires: new Date(Date.now() + durationInSec * 1000),
    });
}

export async function getUserFromCookie(cookie: string): Promise<User | null> {
    return new Promise<User>((resolve, reject) => {
        jwt.verify(cookie, process.env.JWT_SECRET, {}, async (err, payload) => {
            if (err) reject(err);
            const username = payload["username"];

            if (!username) return resolve(null);

            resolve(await UserModel.findOne({ username }));
        });
    });
}
