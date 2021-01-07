import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    components: {
        Heading: {
            baseStyle: {
                fontFamily: "Montserrat,sans-serif",
            },
        },
    },
});

export default theme;
