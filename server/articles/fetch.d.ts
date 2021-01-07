import { ErrorType } from "../api-types";
import { Articles } from "../Models/article";
import { FetchArticlesPayload } from "./types";
export declare function fetchArticle(id: string): Promise<Articles | null>;
export declare function fetchArticles(userId?: string, tag?: string, from?: Date, count?: number): Promise<Exclude<FetchArticlesPayload, ErrorType>>;
