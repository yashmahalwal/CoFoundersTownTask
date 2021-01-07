import { GetServerSideProps } from "next";
import {
    Container,
    Divider,
    Heading,
    Tag,
    TagLabel,
    Text,
    useToast,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { Articles } from "../../server/Models/article";
import { FetchArticlePayload } from "../../server/articles/types";
import dynamic from "next/dynamic";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
import Head from "next/head";
import React, { useMemo } from "react";

type Props = { article: Articles } | { error: string };

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
    ssr: false,
});

const mdParser = new MarkdownIt(/* Markdown-it options */);

const UserPage: NextPage<Props> = (props: Props) => {
    const toast = useToast();

    const date = useMemo(() => {
        if (!("article" in props)) return null;

        const d = new Date(props.article.createdOn);

        return (
            <Text fontSize="xs" color="gray.500">
                Article by <b>{props.article.userId}</b>
                <br />
                {d.toDateString()} {d.toLocaleTimeString()}
            </Text>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, ["article" in props && props.article.createdOn]);

    if ("error" in props) {
        toast({ title: props.error, status: "error" });
        return null;
    }
    return (
        <>
            <Head>
                <title>{props.article.title}</title>
            </Head>
            <Container maxW="6xl">
                <Heading>{props.article.title}</Heading>
                <Wrap mt={2} mb={2}>
                    {props.article.tags.map((item, index) => (
                        <WrapItem key={index}>
                            <Tag
                                borderRadius="full"
                                variant="solid"
                                colorScheme="green">
                                <TagLabel>{item}</TagLabel>
                            </Tag>
                        </WrapItem>
                    ))}
                </Wrap>
                <Text mb={2}>{props.article.description}</Text>
                {date}
                <Divider mb={2} mt={2} />
                <MdEditor
                    readOnly
                    value={props.article.content}
                    style={{
                        border: "none",
                    }}
                    config={{
                        view: {
                            menu: false,
                            md: false,
                        },
                    }}
                    renderHTML={(text) => mdParser.render(text)}
                />
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
    context
) => {
    let props: Props;
    try {
        const payload = await fetch(
            new URL(
                `/articleAction/fetch/${context.params.id}`,
                process.env.NEXT_PUBLIC_BACKEND_URL
            ).href
        );
        const res: FetchArticlePayload = await payload.json();
        if ("error" in res) props = { error: res.error };
        else props = { article: res.article };
    } catch (e) {
        props = { error: "Something went wrong. Try again later" };
    }
    return { props };
};
export default UserPage;
