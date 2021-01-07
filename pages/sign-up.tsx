import { Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import CardContainer from "../components/CardContainer";
import FullHeightPage from "../components/FullHeightPage";
import SignUpForm from "../components/SignUp/form";

const SignUpPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Sign Up</title>
            </Head>
            <FullHeightPage>
                <CardContainer>
                    <Heading textAlign="center" as="h1" fontSize="md">
                        Create an account
                    </Heading>
                    <SignUpForm />
                </CardContainer>
            </FullHeightPage>
        </>
    );
};

export default SignUpPage;
