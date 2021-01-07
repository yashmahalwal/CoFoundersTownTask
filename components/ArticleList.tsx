import {
    List,
    ListItem,
    Heading,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    Link as ChakraLink,
    Text,
    Center,
    Button,
    useToast,
    ButtonProps,
} from "@chakra-ui/react";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";
import { FetchArticlesPayload } from "../server/articles/types";
import { Articles } from "../server/Models/article";

interface Props {
    articles: Omit<Articles, "content">[];
    setArticles: (
        updateFunction: (oldList: Props["articles"]) => Props["articles"]
    ) => void;
    buttonVariant?: ButtonProps["variant"];
    count: number;
    setCount: (a: number) => void;
    fetchMore: () => Promise<FetchArticlesPayload>;
}

const ArticleList: React.FunctionComponent<Props> = (props) => {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    return (
        <>
            <List spacing={3}>
                {props.articles.map((a) => {
                    const date = new Date(a.createdOn);
                    return (
                        <ListItem
                            bg="white"
                            p={2}
                            boxShadow="xs"
                            key={a.articleId}>
                            <Heading size="sm" as="h3">
                                <Link passHref href={`/article/${a.articleId}`}>
                                    <ChakraLink>{a.title}</ChakraLink>
                                </Link>
                            </Heading>

                            <Text fontSize="xs" color="gray.500">
                                {a.userId}
                            </Text>
                            <Text fontSize="lg" mt={1} mb={1}>
                                {a.description}
                            </Text>
                            <Wrap mt={2} mb={2}>
                                {a.tags.map((item, index) => (
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
                            <Text fontSize="xs" color="gray.500">
                                {date.toDateString()}{" "}
                                {date.toLocaleTimeString()}
                            </Text>
                        </ListItem>
                    );
                })}
            </List>
            <Center mt={4}>
                {props.articles.length > 0 &&
                    props.articles.length < props.count && (
                        <Button
                            variant={props.buttonVariant ?? "outline"}
                            colorScheme="blue"
                            size="sm"
                            leftIcon={
                                <FontAwesomeIcon
                                    icon={faAngleDoubleDown}></FontAwesomeIcon>
                            }
                            isLoading={loading}
                            onClick={async () => {
                                setLoading(true);
                                const result = await props.fetchMore();

                                if ("error" in result)
                                    toast({
                                        title: result.error,
                                        status: "error",
                                    });
                                else {
                                    props.setArticles((list) => [
                                        ...list,
                                        ...result.data,
                                    ]);
                                    props.setCount(
                                        result.totalCount[0]?.count ?? 0
                                    );
                                }
                                setLoading(false);
                            }}>
                            Load More
                        </Button>
                    )}
            </Center>
        </>
    );
};

export default ArticleList;
