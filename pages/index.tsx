import { GetServerSideProps } from "next";
import {
    Container,
    Heading,
    AlertIcon,
    Alert,
    Button,
    Center,
    useToast,
    useDisclosure,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { FetchArticlesPayload } from "../server/articles/types";
import "react-markdown-editor-lite/lib/index.css";
import Head from "next/head";
import ArticleList from "../components/ArticleList";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import TagSearch from "../components/Home/TagSearch";
import { getArticles } from "../components/Home/getArticles";
import { Articles } from "../server/Models/article";

type Props = FetchArticlesPayload;

const HomePage: NextPage<Props> = (props: Props) => {

    const [list, setList] = useState<Omit<Articles, "content">[]>(
        "data" in props ? props.data : []
    );
    const [count, setCount] = useState<number>(
        "totalCount" in props ? props.totalCount[0]?.count ?? 0 : 0
    );

    if ("error" in props)
        return (
            <Alert mb={4} fontSize="sm" status="error">
                <AlertIcon />
                {props.error}
            </Alert>
        );

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <Container maxW="6xl" pb={6}>
                <Heading size="md" as="h2" mb={4} mt={6}>
                    Latest Articles
                </Heading>
                <ArticleList
                    articles={list}
                    count={count}
                    setCount={setCount}
                    setArticles={setList}
                    fetchMore={() =>
                        getArticles(
                            3,
                            (list[list.length - 1]
                                ?.createdOn as unknown) as string
                        )
                    }
                />
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    return { props: await getArticles(5) };
};
export default HomePage;
