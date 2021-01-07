import {
    Link as ChakraLink,
    Box,
    Button,
    HStack,
    useDisclosure,
    toast,
    useToast,
} from "@chakra-ui/react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Success } from "../server/api-types";
import TagSearch from "./Home/TagSearch";
import { useViewer } from "./ViewerContext";

const Header: React.FunctionComponent = () => {
    const router = useRouter();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const viewer = useViewer();
    if (router.pathname === "/login" || router.pathname === "/sign-up")
        return null;

    return (
        <>
            <TagSearch open={isOpen} close={onClose}></TagSearch>
            <Box
                zIndex={1000}
                bg="blue.500"
                boxShadow="lg"
                position="sticky"
                top={0}
                mb={2}
                p={2}>
                <HStack justify="space-between">
                    <Button
                        isFullWidth
                        onClick={onOpen}
                        leftIcon={
                            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                        }
                        justifyContent="flex-start"
                        boxShadow="base"
                        role="search"
                        color="gray.400"
                        bg="white">
                        Search by tags
                    </Button>
                    <Button onClick={() => router.push("/")} colorScheme="blue">
                        Home
                    </Button>
                    {viewer ? (
                        <>
                            <Button
                                onClick={() =>
                                    router.push(`/user/${viewer.username}`)
                                }
                                colorScheme="blue">
                                Profile
                            </Button>
                            <Button
                                onClick={() => window.open("/publish", "_self")}
                                colorScheme="blue">
                                Publish
                            </Button>
                            <Button
                                onClick={async () => {
                                    try {
                                        const result: Success = await (
                                            await fetch(
                                                new URL(
                                                    "/userAction/logout",
                                                    process.env.NEXT_PUBLIC_BACKEND_URL
                                                ).href,
                                                {
                                                    method: "POST",
                                                    credentials: "include",
                                                }
                                            )
                                        ).json();

                                        if (result.success)
                                            window.open("/login", "_self");
                                    } catch {
                                        toast({
                                            title:
                                                "Something went wrong. Try again later",
                                            status: "error",
                                        });
                                    }
                                }}
                                colorScheme="blue">
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => router.push("/login")}
                            colorScheme="blue">
                            Log In
                        </Button>
                    )}
                </HStack>
            </Box>
        </>
    );
};

export default Header;
