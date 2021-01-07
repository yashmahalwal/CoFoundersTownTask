import { FetchArticlesPayload } from "../../server/articles/types";

export async function getArticles(
    count = 5,
    from?: string,
    tag?: string,
    userId?: string
): Promise<FetchArticlesPayload> {
    try {
        const url = new URL(
            `/articleAction/fetch`,
            process.env.NEXT_PUBLIC_BACKEND_URL
        );

        url.searchParams.append("count", count.toString());
        if (from) url.searchParams.append("from", from);
        if (tag) url.searchParams.append("tag", tag);
        if (userId) url.searchParams.append("userId", userId);

        const payload = await (await fetch(url.href)).json();
        return payload;
    } catch (e) {
        return { error: "Something went wrong. Try again later", code: 500 };
    }
}
