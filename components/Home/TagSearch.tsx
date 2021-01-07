import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Spinner,
    VisuallyHidden,
    useToast,
    Box,
} from "@chakra-ui/react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Articles } from "../../server/Models/article";
import ArticleList from "../ArticleList";
import { useDebouncedSearch } from "../DebouncedSearch";
import TextField from "../TextField";
import { getArticles } from "./getArticles";

interface Props {
    open: boolean;
    close: () => void;
}

const TagSearch: React.FunctionComponent<Props> = (props) => {
    const [list, setList] = useState<Omit<Articles, "content">[]>([]);

    const {
        inputText,
        searchResults,
        setInputText,
    } = useDebouncedSearch((tag: string) => getArticles(3, undefined, tag));

    const toast = useToast();
    const [totalCount, setTotalCount] = useState(0);
    useEffect(() => {
        if (!searchResults.result || Array.isArray(searchResults.result)) {
            setList([]);
            return;
        }

        if ("error" in searchResults.result) {
            toast({ title: searchResults.result.error, status: "error" });
            return;
        }

        setList(searchResults.result.data);
        setTotalCount(searchResults.result.totalCount[0]?.count ?? 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchResults.result]);

    return (
        <Modal isOpen={props.open} onClose={props.close}>
            <ModalOverlay />
            <ModalContent boxShadow="none" background="transparent">
                <ModalBody>
                    <TextField
                        bg="white"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rightAdornment={searchResults.loading && <Spinner />}
                        leftAdornment={
                            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                        }
                        placeholder="Tag"
                        label={<VisuallyHidden>Tag</VisuallyHidden>}
                    />
                    <Box>
                        <ArticleList
                            buttonVariant="solid"
                            setArticles={setList}
                            setCount={setTotalCount}
                            count={totalCount}
                            articles={list}
                            fetchMore={() =>
                                getArticles(
                                    3,
                                    (list[list.length - 1]
                                        ?.createdOn as unknown) as string,
                                    inputText
                                )
                            }
                        />
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default TagSearch;
