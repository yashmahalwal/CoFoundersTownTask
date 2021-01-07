import { prop, getModelForClass } from "@typegoose/typegoose";
export class Articles {
    @prop({ required: true })
    articleId: string;
    @prop({ required: true })
    userId: string;
    @prop({ required: true })
    title: string;
    @prop({ required: true })
    content: string;
    @prop({ required: true, maxlength: 255 })
    description: string;
    @prop({ required: true, maxItems: 5, type: [String] })
    tags: string[];
    @prop({ required: true })
    createdOn: Date;
}

export const ArticleModel = getModelForClass(Articles);
