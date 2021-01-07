import Router from "next/router";
import { ChakraProvider, Fade, Progress } from "@chakra-ui/react";
import type { AppContext, AppProps } from "next/app";
import theme from "../components/theme";
import "../components/global.css";
import React, { useState } from "react";
import Header from "../components/Header";
import App from "next/app";
import { ViewerPayload } from "../server/users/types";
import {
    ViewerContextProps,
    ViewerProvider,
} from "../components/ViewerContext";

interface Props {
    viewer: ViewerContextProps["viewer"];
}

const MyApp = ({
    Component,
    pageProps,
    viewer,
}: AppProps & Props): JSX.Element => {
    const [routeLoading, setRouteLoading] = useState(false);

    Router.events.on("routeChangeStart", () => setRouteLoading(true));
    Router.events.on("routeChangeComplete", () => setRouteLoading(false));
    Router.events.on("routeChangeError", () => setRouteLoading(false));
    return (
        <ChakraProvider theme={theme}>
            <ViewerProvider viewer={viewer}>
                <Fade in={routeLoading}>
                    <Progress
                        colorScheme="pink"
                        size="xs"
                        isIndeterminate
                        position="fixed"
                        zIndex={2000}
                        top={0}
                        left={0}
                        right={0}
                    />
                </Fade>
                <Header />
                <Component {...pageProps} />
            </ViewerProvider>
        </ChakraProvider>
    );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);
    const token = ((appContext.ctx.req as unknown) as Express.Request)?.context
        .token;
    const headers: Record<string, string> = {};

    if (token) headers["token"] = token;

    const payload = await fetch(
        new URL(`/userAction/viewer`, process.env.NEXT_PUBLIC_BACKEND_URL).href,
        {
            credentials: "include",
            headers,
        }
    );
    const res: ViewerPayload = await payload.json();
    const props: Props = { viewer: null };

    if ("user" in res) props.viewer = res.user;
    else props.viewer = null;

    return { ...appProps, ...props };
};

export default MyApp;
