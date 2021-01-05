import { NextPage } from "next";
import { Text } from "@chakra-ui/react";
const LoginPage: NextPage = () => {
    return (
        <Text
            bgGradient="linear(to-l, #7928CA,#FF0080)"
            bgClip="text"
            fontSize="6xl"
            fontWeight="extrabold">
            Hello World
        </Text>
    );
};

export default LoginPage;
