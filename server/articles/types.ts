import { ErrorType, Success } from "../api-types";
import { Articles } from "../Models/article";

export function isCreateArticlePayload(
    payload: unknown
): payload is Omit<Articles, "userId" | "createdOn" | "id"> {
    if (!payload || typeof payload !== "object") return false;

    return (
        typeof payload["title"] === "string" &&
        typeof payload["description"] === "string" &&
        payload["description"].length <= 255 &&
        typeof payload["content"] === "string" &&
        Array.isArray(payload["tags"]) &&
        payload["tags"].length <= 5 &&
        payload["tags"].every((e) => typeof e === "string")
    );
}

export type PublishArticlePayload = Success | ErrorType;
export type FetchArticlePayload = { article: Articles } | ErrorType;
export type FetchArticlesPayload =
    | { data: Omit<Articles, "content">[]; totalCount: [{ count: number }] }
    | ErrorType;
