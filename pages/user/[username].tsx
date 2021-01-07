import { GetServerSideProps } from "next";
import {
    Avatar,
    Box,
    Container,
    Divider,
    Heading,
    List,
    ListItem,
    Stack,
    useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { UserFetchPayload } from "../../server/users/types";
import { FetchArticlesPayload } from "../../server/articles/types";
import { getArticles } from "../../components/Home/getArticles";
import ArticleList from "../../components/ArticleList";
import { Articles } from "../../server/Models/article";
import Head from "next/head";

interface Props {
    userData: UserFetchPayload;
    articleList: FetchArticlesPayload;
}

const UserPage: NextPage<Props> = ({ userData, articleList }) => {
    const router = useRouter();
    const toast = useToast();

    const [list, setList] = useState<Omit<Articles, "content">[]>(
        "data" in articleList ? articleList.data : []
    );
    const [count, setCount] = useState<number>(
        "totalCount" in articleList ? articleList.totalCount[0]?.count ?? 0 : 0
    );

    useEffect(() => {
        if ("error" in userData && userData.code === 401) {
            toast({ title: userData.error, status: "error" });
            router.push("/");
            return;
        }

        if ("error" in articleList) {
            toast({ title: articleList.error, status: "error" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if ("error" in userData) return null;

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <Box pt={6} pb={6}>
                <Container
                    maxW="lg"
                    mt={4}
                    background={"error" in userData ? "red.100" : "gray.50"}
                    p={2}
                    boxShadow="base"
                    borderRadius={5}>
                    <Heading textAlign="center" mb={4} as="h1" size="md">
                        User Information
                    </Heading>
                    <Stack
                        direction={["column-reverse", "column-reverse", "row"]}
                        justify="space-around"
                        align="center"
                        spacing="24px">
                        <List textAlign={["center", "center", "left"]}>
                            <ListItem>
                                <b>Username</b>: {userData.user.username}{" "}
                            </ListItem>
                            <ListItem>
                                <b>Name</b>: {userData.user.name}{" "}
                            </ListItem>
                            <ListItem>
                                <b>Email</b>: {userData.user.email}{" "}
                            </ListItem>
                            <ListItem>
                                <b>Age</b>: {userData.user.age}{" "}
                            </ListItem>
                        </List>
                        <Avatar name={userData.user.name} size="2xl" />
                    </Stack>
                </Container>
                <Container maxW="6xl">
                    {"data" in articleList && articleList.data.length > 0 && (
                        <>
                            <Divider mt={4} mb={2} />
                            <Heading mb={6} size="md" as="h2">
                                Your Articles
                            </Heading>
                            <ArticleList
                                articles={list}
                                count={count}
                                setArticles={setList}
                                setCount={setCount}
                                fetchMore={() =>
                                    getArticles(
                                        5,
                                        (list[list.length - 1]
                                            ?.createdOn as unknown) as string,
                                        undefined,
                                        userData.user.username
                                    )
                                }
                            />
                        </>
                    )}
                </Container>
            </Box>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
    context
) => {
    const token = ((context.req as unknown) as Express.Request)?.context.token;
    let userData: Props["userData"];
    let articleList: Props["articleList"] = {
        data: [],
        totalCount: [{ count: 0 }],
    };
    const headers: Record<string, string> = {};

    if (token) headers["token"] = token;
    try {
        const payload = await fetch(
            new URL(
                `/userAction/fetch/${context.params.username}`,
                process.env.NEXT_PUBLIC_BACKEND_URL
            ).href,
            {
                credentials: "include",
                headers,
            }
        );
        const res = await payload.json();
        userData = res;

        if ("user" in userData && userData.user)
            articleList = await getArticles(
                5,
                undefined,
                undefined,
                userData.user.username
            );
    } catch (e) {
        userData = {
            error: "Something went wrong. Try again later",
            code: 500,
        };
    }
    return {
        props: {
            userData,
            articleList,
        },
    };
};
export default UserPage;
