import { Container, ContainerProps } from "@chakra-ui/react";
import React from "react";

const CardContainer: React.FC<ContainerProps> = ({ children, ...props }) => {
    return (
        <Container
            p={4}
            boxShadow={{ md: "2xl" }}
            background="white"
            maxW="450px"
            {...props}>
            {children}
        </Container>
    );
};

export default CardContainer;
