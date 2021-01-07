import { v4 as uuid } from "uuid";
import { ArticleModel } from "../Models/article";

export async function publishArticle(
    userId: string,
    title: string,
    content: string,
    description: string,
    tags: string[]
): Promise<void> {
    await ArticleModel.create({
        articleId: uuid(),
        createdOn: new Date(),
        userId,
        title,
        content,
        description,
        tags: tags.map((t) => t.toLowerCase()),
    });
}
