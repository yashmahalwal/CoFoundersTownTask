import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";
import UserRouter from "./users";
import ArticleRouter from "./articles";
import cors from "cors";
import { getUserFromCookie } from "./users/login";
import next from "next";
config({
    path: path.resolve(__dirname, ".env"),
});

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

(async function () {
    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.MONGODB_DB,
    });

    await app.prepare();
    const server = express();
    server.use(
        cors({
            origin: process.env.FRONTEND_URL,
            credentials: true,
        })
    );
    server.use(express.json());
    server.use(cookieParser());
    server.use(async (req, res, next) => {
        req.context = {};
        const token = req.cookies["token"] ?? req.headers["token"];
        if (token) {
            req.context.user = await getUserFromCookie(token);
            req.context.token = token;
        }
        next();
    });

    server.use("/article/:id", (req, res) => {
        app.render(req, res, `/article/${req.params.id}`, {
            ...req.params,
            ...req.query,
        } as Record<string, string>);
    });
    server.use("/publish", (req, res) => {
        console.log(req.context.user);
        if (!req.context.user) return res.redirect("/");
        return app.render(req, res, "/publish");
    });

    server.use("/userAction", UserRouter);
    server.use("/articleAction", ArticleRouter);

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
})();
