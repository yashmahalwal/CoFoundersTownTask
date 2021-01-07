import Head from "next/head";
import { NextPage } from "next";
import CardContainer from "../components/CardContainer";
import FullHeightPage from "../components/FullHeightPage";
import LoginForm from "../components/Login/form";
const LoginPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <FullHeightPage>
                <CardContainer>
                    <LoginForm />
                </CardContainer>
            </FullHeightPage>
        </>
    );
};

export default LoginPage;
