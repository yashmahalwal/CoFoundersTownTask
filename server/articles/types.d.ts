import { ErrorType, Success } from "../api-types";
import { Articles } from "../Models/article";
export declare function isCreateArticlePayload(payload: unknown): payload is Omit<Articles, "userId" | "createdOn" | "id">;
export declare type PublishArticlePayload = Success | ErrorType;
export declare type FetchArticlePayload = {
    article: Articles;
} | ErrorType;
export declare type FetchArticlesPayload = {
    data: Omit<Articles, "content">[];
    totalCount: [{
        count: number;
    }];
} | ErrorType;
