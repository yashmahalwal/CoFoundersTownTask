import { Spinner, Text } from "@chakra-ui/react";
import { faCheck, faCross, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useMemo } from "react";
import TextField, { TextFieldProps } from "../TextField";
export interface UsernameProps extends TextFieldProps {
    state?: "loading" | "available" | "unavailable";
}

const Username = forwardRef<HTMLInputElement, UsernameProps>(
    ({ state, ...props }, ref) => {
        const rightAdornment = useMemo(() => {
            switch (state) {
                case "available":
                    return (
                        <Text as="span" color="green.600">
                            <FontAwesomeIcon icon={faCheck} />
                        </Text>
                    );
                case "unavailable":
                    return (
                        <Text as="span" color="red.600">
                            <FontAwesomeIcon icon={faTimes} />
                        </Text>
                    );

                case "loading":
                    return <Spinner size="xs" />;
                default:
                    return null;
            }
        }, [state]);

        return (
            <TextField rightAdornment={rightAdornment} {...props} ref={ref} />
        );
    }
);

Username.displayName = "Username";
export default Username;
