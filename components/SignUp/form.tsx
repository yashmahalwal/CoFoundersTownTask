import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Text,
    VisuallyHidden,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import PasswordToggle from "../PasswordToggle";
import TextField from "../TextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faKey,
    faIdBadge,
    faCalendar,
    faSignature,
} from "@fortawesome/free-solid-svg-icons";
import Username, { UsernameProps } from "./username";
import { makeResolvable, ResolvablePromise } from "../ResolvablePromise";
import { UsernameAvailabilityPayload } from "../../server/users/types";
import { useRouter } from "next/router";

const defaultValues = {
    email: "",
    name: "",
    password: "",
    username: "",
    age: 18,
};

const schema = yup.object({
    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Please enter your email address"),
    password: yup.string().required("Please enter your password"),
    age: yup
        .number()
        .min(0, "Age cannot be lower than 0")
        .required("Please enter your age"),
    name: yup.string().required("Please enter your name"),
    username: yup.string().required("Please enter your username"),
});

const SignUpForm: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, errors, handleSubmit } = useForm({
        mode: "onTouched",
        defaultValues,
        resolver: yupResolver(schema),
    });

    const [errorMsg, setErrMsg] = useState("");
    const onSubmit = async (values: typeof defaultValues) => {
        setLoading(true);
        try {
            const payload = await fetch(
                new URL(
                    "/userAction/create",
                    process.env.NEXT_PUBLIC_BACKEND_URL
                ).href,
                {
                    body: JSON.stringify({ user: values }),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            const res = await payload.json();

            if ("error" in res) throw new Error(res.error);

            // Success
            router.push("/login");
        } catch (e) {
            setErrMsg(e.mssage);
        }
        setLoading(false);
    };

    const [usernameState, setUsernameState] = useState<
        UsernameProps["state"] | null
    >(null);
    const usernamePromiseRef = useRef<ResolvablePromise<unknown> | null>(null);

    const usernameMessage = React.useMemo(() => {
        switch (usernameState) {
            case "available":
                return "Username is available";
            case "unavailable":
                return "Username is taken";
            case "loading":
                return "Loading";
            case null:
                return "Type in a username to check availability";
        }
    }, [usernameState]);

    const onUsernameChange = async (username: string) => {
        if (!username) return setUsernameState(null);

        setUsernameState("loading");

        if (usernamePromiseRef.current) {
            usernamePromiseRef.current.resolve({ error: "Debounced" });
        }

        try {
            const url = new URL(
                "/userAction/check",
                process.env.NEXT_PUBLIC_BACKEND_URL
            );
            url.searchParams.append("username", username);

            const usernamePromise = makeResolvable<UsernameAvailabilityPayload>(
                fetch(url.href).then((res) => res.json())
            );
            usernamePromiseRef.current = usernamePromise;
            const payload = await usernamePromise.promise;

            if ("error" in payload) throw new Error(payload.error);

            setUsernameState(payload.available ? "available" : "unavailable");
        } catch (e) {
            // Do not disturb the loading state
            if (e === "Debounced") return;
            // Go back to neutral if a genuine error occurs
            // Supress the error - Better UX: Not critical anyway
            setUsernameState(null);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box mt="2rem" mb="1.5rem">
                {errorMsg && (
                    <Alert mb={4} fontSize="sm" status="error">
                        <AlertIcon />
                        {errorMsg}
                    </Alert>
                )}
                <Username
                    onChange={(e) => onUsernameChange(e.target.value)}
                    state={usernameState}
                    placeholder="Username"
                    leftAdornment={
                        <Text as="span" color="gray.400">
                            <FontAwesomeIcon icon={faIdBadge} />
                        </Text>
                    }
                    id="signup-username"
                    name="username"
                    isInvalid={
                        !!errors.username || usernameState === "unavailable"
                    }
                    helperText={errors.username?.message ?? usernameMessage}
                    ref={register}
                />
                <Box mt={4}>
                    <TextField
                        type="number"
                        name="age"
                        ref={register}
                        leftAdornment={
                            <Text as="span" color="gray.400">
                                <FontAwesomeIcon icon={faCalendar} />
                            </Text>
                        }
                        label={<VisuallyHidden>Email</VisuallyHidden>}
                        placeholder="Age"
                        id="signup-age"
                        isInvalid={!!errors.age}
                        helperText={errors.age?.message}
                    />
                </Box>
                <Box mt={4}>
                    <TextField
                        name="name"
                        ref={register}
                        leftAdornment={
                            <Text as="span" color="gray.400">
                                <FontAwesomeIcon icon={faSignature} />
                            </Text>
                        }
                        label={<VisuallyHidden>Name</VisuallyHidden>}
                        placeholder="Name"
                        id="signup-name"
                        isInvalid={!!errors.name}
                        helperText={errors.name?.message}
                    />
                </Box>
                <Box mt={4}>
                    <TextField
                        type="email"
                        name="email"
                        ref={register}
                        leftAdornment={
                            <Text as="span" color="gray.400">
                                <FontAwesomeIcon icon={faUser} />
                            </Text>
                        }
                        label={<VisuallyHidden>Email</VisuallyHidden>}
                        placeholder="Email"
                        id="signup-email"
                        isInvalid={!!errors.email?.type}
                        helperText={errors.email?.message}
                    />
                </Box>
                <Box mt={4}>
                    <PasswordToggle
                        name="password"
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
            </Box>
            <Button
                aria-live="polite"
                disabled={
                    usernameState === "loading" ||
                    usernameState === "unavailable"
                }
                isLoading={loading}
                type="submit"
                isFullWidth
                colorScheme="blue">
                Sign Up
            </Button>
        </form>
    );
};

export default SignUpForm;
