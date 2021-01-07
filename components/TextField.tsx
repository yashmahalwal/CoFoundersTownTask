import {
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    InputProps,
    InputRightElement,
} from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

export interface TextFieldProps extends InputProps {
    label?: React.ReactNode;
    helperText?: React.ReactNode;
    leftAdornment?: React.ReactNode;
    rightAdornment?: React.ReactNode;
}

const TextField = React.forwardRef<
    HTMLInputElement,
    PropsWithChildren<TextFieldProps>
>(
    (
        {
            label,
            rightAdornment,
            leftAdornment,
            helperText,
            id,
            isInvalid,
            isDisabled,
            isRequired,
            isReadOnly,
            ...props
        },
        ref
    ) => {
        return (
            <FormControl
                id={id}
                isInvalid={!!isInvalid}
                isRequired={!!isRequired}
                isDisabled={!!isDisabled}
                isReadOnly={!!isReadOnly}>
                <FormLabel>{label}</FormLabel>
                <InputGroup>
                    {leftAdornment && (
                        <InputLeftElement>{leftAdornment}</InputLeftElement>
                    )}
                    <Input ref={ref} {...props} />
                    {rightAdornment && (
                        <InputRightElement p={0}>
                            {rightAdornment}
                        </InputRightElement>
                    )}
                </InputGroup>
                {!isInvalid && <FormHelperText>{helperText}</FormHelperText>}
                {isInvalid && <FormErrorMessage>{helperText}</FormErrorMessage>}
            </FormControl>
        );
    }
);

TextField.defaultProps = {
    label: "",
    helperText: "",
} as TextFieldProps;

TextField.displayName = "TextField";

export default TextField;
