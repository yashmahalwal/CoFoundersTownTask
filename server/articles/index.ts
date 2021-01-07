import express from "express";
import { isCreateArticlePayload } from "./types";
import "./publish";
import { publishArticle } from "./publish";
import "./fetch";
import { fetchArticle, fetchArticles } from "./fetch";
const router = express.Router();

router.post("/publish", async (req, res) => {
    const article = req.body.article;
    const user = req?.context?.user;
    if (!isCreateArticlePayload(article)) return res.sendStatus(400);
    if (!user) return res.sendStatus(401);

    try {
        await publishArticle(
            user.username,
            article.title,
            article.content,
            article.description,
            article.tags
        );
        res.json({ success: true });
    } catch (e) {
        res.json({ error: "Something went wrong, try again later" });
    }
});

router.get("/fetch/:articleId", async (req, res) => {
    const articleId = req.params.articleId;

    if (!articleId) return res.sendStatus(400);

    try {
        const article = await fetchArticle(articleId);

        if (!article) res.json({ error: "Article not found" });
        else res.json({ article });
    } catch {
        res.json({ error: "Something went wrong, try again later" });
    }
});

router.get("/fetch", async (req, res) => {
    const { tag, from, count, userId } = req.query;

    // From is supposed to be an ISO Date string
    let fromDate: Date | undefined;

    if (userId && typeof userId !== "string") return res.sendStatus(400);

    try {
        if (from) fromDate = new Date(from as string);
    } catch {
        return res.sendStatus(400);
    }

    // Count is supposed to be a number, capped at 20
    let fetchCount: number | undefined;
    try {
        if (count) fetchCount = Math.min(20, parseInt(count as string));
    } catch {
        return res.sendStatus(400);
    }

    try {
        const articles = await fetchArticles(
            userId as string | undefined,
            tag as string,
            fromDate,
            fetchCount
        );
        res.json(articles);
    } catch (e) {
        res.json({ error: "Something went wrong, try again later" });
    }
});

export default router;
