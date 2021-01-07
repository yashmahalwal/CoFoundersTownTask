import express from "express";
import { doesUsernameExist } from "./checkUsername";
import { isUser } from "./types";
import { createUser } from "./createUser";
import { createJWTCookie, login } from "./login";
import { UserModel } from "../Models/user";

const router = express.Router();

router.get("/check", async (req, res) => {
    const { username } = req.query;

    if (typeof username != "string" || !username.length)
        return res.sendStatus(400);

    try {
        res.json({
            available: !(await doesUsernameExist(username)),
        });
    } catch {
        res.json({
            error: "Something went wrong, please try again later.",
        });
    }
});

router.post("/create", async (req, res) => {
    const user = req.body.user;

    if (!isUser(user)) return res.sendStatus(400);

    try {
        await createUser(
            user.name,
            user.username,
            user.age,
            user.email,
            user.password
        );
        res.json({ success: true });
    } catch (e) {
        res.json({
            error: "Something went wrong, please try again later.",
        });
    }
});

router.post("/login", async (req, res) => {
    const creds = req.body.credentials;

    if (
        !creds ||
        typeof creds !== "object" ||
        typeof creds["password"] !== "string" ||
        typeof creds["username"] !== "string" ||
        typeof creds["rememberMe"] !== "boolean"
    )
        return res.sendStatus(400);

    try {
        if (await login(creds.username, creds.password)) {
            await createJWTCookie(
                creds.username,
                res,
                creds.rememberMe ? 7 * 24 * 60 * 60 : undefined
            );
            res.json({ success: true });
        } else res.json({ error: "Invalid username or password" });
    } catch (e) {
        res.json({
            error: "Something went wrong, please try again later.",
        });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    return res.json({ success: true });
});

router.get("/fetch/:username", async (req, res) => {
    const { username } = req.params;

    if (!username) return res.sendStatus(400);

    try {
        // Can be extended with roles and rights
        if (username !== req.context.user?.username) {
            return res.json({ error: "You are not authorized", code: 401 });
        }

        const user = await UserModel.findOne({ username });
        if (user)
            return res.json({
                user: {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    age: user.age,
                },
            });
        res.json({ error: "User not found" });
    } catch {
        res.json({ error: "Something went wrong. Try again later" });
    }
});

router.get("/viewer", async (req, res) => {
    const username = req.context.user?.username;

    if (!username) return res.json({ user: null });

    try {
        const user = await UserModel.findOne({ username });
        if (user)
            return res.json({
                user: {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    age: user.age,
                },
            });
        res.json({ error: "User not found" });
    } catch {
        res.json({ error: "Something went wrong. Try again later" });
    }
});

export default router;
