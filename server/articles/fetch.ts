import { ErrorType } from "../api-types";
import { ArticleModel, Articles } from "../Models/article";
import { FetchArticlesPayload } from "./types";

export async function fetchArticle(id: string): Promise<Articles | null> {
    const article = await ArticleModel.findOne({ articleId: id });
    if (!article) return null;

    return article;
}

export async function fetchArticles(
    userId?: string,
    tag?: string,
    from?: Date,
    count?: number
): Promise<Exclude<FetchArticlesPayload, ErrorType>> {
    const matches: Record<string, unknown> = {};
    if (userId) matches.userId = userId;
    if (tag) matches.tags = new RegExp(tag.toLowerCase());

    const countMatch = { ...matches };
    const limit = [];
    if (count) limit.push({ $limit: count });

    if (from) matches.createdOn = { $lt: from };

    const result = await ArticleModel.aggregate([
        {
            $facet: {
                data: [
                    { $match: matches },
                    { $sort: { createdOn: -1 } },
                    { $project: { content: 0 } },
                    ...limit,
                ],
                totalCount: [{ $match: countMatch }, { $count: "count" }],
            },
        },
    ]);

    return result[0];
}
