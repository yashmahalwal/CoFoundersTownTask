import {
    Alert,
    Link as ChakraLink,
    AlertIcon,
    Box,
    Button,
    Center,
    Checkbox,
    HStack,
    Text,
    VisuallyHidden,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import PasswordToggle from "../PasswordToggle";
import TextField from "../TextField";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import Yeti from "../Yeti";
import { UserLoginPayload } from "../../server/users/types";
const defaultValues = {
    email: "",
    password: "",
    rememberMe: true,
};

const schema = yup.object({
    username: yup.string().required("Please enter your username"),
    password: yup.string().required("Please enter your password"),
});

const LoginForm: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, errors, handleSubmit, control } = useForm({
        mode: "onTouched",
        defaultValues,
        resolver: yupResolver(schema),
    });

    const [errorMsg, setErrorMsg] = useState("");
    const onSubmit = async (data: typeof defaultValues) => {
        setLoading(true);
        try {
            const payload = await fetch(
                new URL(
                    "/userAction/login",
                    process.env.NEXT_PUBLIC_BACKEND_URL
                ).href,
                {
                    body: JSON.stringify({ credentials: data }),
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            const res: UserLoginPayload = await payload.json();
            if ("error" in res) throw new Error(res.error);
            window.open("/", "_self");
        } catch (e) {
            setErrorMsg(e.message);
        }

        setLoading(false);
    };

    const [fingersSpread, setFingersSpread] = useState(false);
    const [eyesCovered, setEyesCovered] = useState(false);
    const [emailChangeTrigger, setEmailChangeTrigger] = useState(false);
    const [usernameBlurTrigger, setUsernameBlurTrigger] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <Center>
                <Yeti
                    emailBlurTrigger={usernameBlurTrigger}
                    emailRef={emailRef}
                    eyesCovered={eyesCovered}
                    fingersSpread={fingersSpread}
                    emailChangeTrigger={emailChangeTrigger}
                />
            </Center>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box mt="2rem" mb="1.5rem">
                    {errorMsg && (
                        <Alert mb={4} fontSize="sm" status="error">
                            <AlertIcon />
                            {errorMsg}
                        </Alert>
                    )}
                    <TextField
                        onChange={() => setEmailChangeTrigger((e) => !e)}
                        onFocus={() => setEmailChangeTrigger((e) => !e)}
                        onBlur={() => {
                            setUsernameBlurTrigger((e) => !e);
                        }}
                        type="username"
                        name="username"
                        ref={(instance) => {
                            register(instance);
                            emailRef.current = instance;
                        }}
                        leftAdornment={
                            <Text as="span" color="gray.400">
                                <FontAwesomeIcon icon={faUser} />
                            </Text>
                        }
                        label={<VisuallyHidden>Username</VisuallyHidden>}
                        placeholder="Username"
                        id="login-email"
                        isInvalid={!!errors.username?.type}
                        helperText={errors.username?.message}
                    />
                    <Box
                        mt={4}
                        onFocusCapture={() => setEyesCovered(true)}
                        onBlurCapture={() => setEyesCovered(false)}>
                        <PasswordToggle
                            name="password"
                            onTypeChange={(t) =>
                                setFingersSpread(t !== "password")
                            }
                            leftAdornment={
                                <Text as="span" color="gray.400">
                                    <FontAwesomeIcon icon={faKey} />
                                </Text>
                            }
                            ref={register}
                            label={<VisuallyHidden>Password</VisuallyHidden>}
                            placeholder="Password"
                            id="login-password"
                            isInvalid={!!errors.password?.type}
                            helperText={errors.password?.message}
                        />
                    </Box>
                    <HStack mt={4} align="center" justify="space-between">
                        <Controller
                            name="rememberMe"
                            control={control}
                            defaultValue={false}
                            rules={{ required: true }}
                            render={(props) => (
                                <Checkbox
                                    isChecked={props.value}
                                    ref={register}
                                    {...props}
                                    onChange={(e) =>
                                        props.onChange(e.target.checked)
                                    }>
                                    <Text color="gray.500" fontSize="sm">
                                        Remember Me
                                    </Text>
                                </Checkbox>
                            )} // props contains: onChange, onBlur and value
                        />
                        <Link passHref href="/sign-up">
                            <ChakraLink>
                                <Text color="gray.500" fontSize="sm">
                                    Create an account
                                </Text>
                            </ChakraLink>
                        </Link>
                    </HStack>
                </Box>
                <Button
                    aria-live="polite"
                    isLoading={loading}
                    type="submit"
                    isFullWidth
                    colorScheme="blue">
                    Sign In
                </Button>
                <Button
                    mt={2}
                    onClick={() => router.push("/")}
                    disabled={loading}
                    aria-live="polite"
                    isFullWidth
                    variant="outline">
                    Proceed Without Signing In
                </Button>
            </form>
        </>
    );
};

export default LoginForm;
