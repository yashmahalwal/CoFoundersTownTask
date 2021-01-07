export declare class Articles {
    articleId: string;
    userId: string;
    title: string;
    content: string;
    description: string;
    tags: string[];
    createdOn: Date;
}
export declare const ArticleModel: import("@typegoose/typegoose").ReturnModelType<typeof Articles, {}>;
