import * as yup from "yup";
import { NextPage } from "next";
import MarkdownIt from "markdown-it";
import dynamic from "next/dynamic";
import "react-markdown-editor-lite/lib/index.css";
import { useRef, useState } from "react";
import {
    Box,
    Button,
    Center,
    Container,
    IconButton,
    Tag,
    TagCloseButton,
    TagLabel,
    Text,
    Textarea,
    useToast,
    VisuallyHidden,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import TextField from "../components/TextField";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
    ssr: false,
});

const mdParser = new MarkdownIt(/* Markdown-it options */);

const defaultValues = {
    content: "",
    title: "",
    description: "",
    tags: [],
};

const schema = yup.object({
    title: yup.string().required("Please enter a title"),
    content: yup.string().required("Content cannot be empty"),
    description: yup
        .string()
        .required("Please enter a description")
        .max(255, "Description cannot be longer than 255 characters"),
    tags: yup.array().max(5, "Tags cannot be more than ${max}"),
});

const PublishPage: NextPage = () => {
    const { control, handleSubmit, register, errors } = useForm({
        defaultValues,
        mode: "onTouched",
        resolver: yupResolver(schema),
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tags",
    });

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [tagInput, setTagInput] = useState("");
    const tagSet = useRef<Set<string>>(new Set());

    const onSubmit = async (data: typeof defaultValues) => {
        setLoading(true);
        try {
            !data.tags && (data.tags = []);
            data.tags = data.tags.map((t) => t.data);

            const payload = await fetch(
                new URL(
                    "/articleAction/publish",
                    process.env.NEXT_PUBLIC_BACKEND_URL
                ).href,
                {
                    credentials: "include",
                    body: JSON.stringify({ article: data }),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            const res = await payload.json();
            if ("error" in res) throw new Error(res["error"]);
            toast({ title: "Article published", status: "success" });
        } catch (e) {
            toast({ title: e.message, status: "error" });
        }

        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Publish</title>
            </Head>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="content"
                    render={({ onChange, onBlur, value }, { invalid }) => (
                        <MdEditor
                            name="content"
                            value={value}
                            onBlur={onBlur}
                            onChange={({ text }) => onChange(text)}
                            style={{
                                height: "80vh",
                                border: invalid ? "solid red 2px" : "none",
                            }}
                            renderHTML={(text) => mdParser.render(text)}
                        />
                    )}
                />
                <Text ml={2} fontSize="xs" color="red.500">
                    {errors.content?.message}
                </Text>
                <Container maxW="6xl" mt={6} mb={4}>
                    <TextField
                        isInvalid={!!errors.title}
                        ref={register}
                        name="title"
                        id="publish-title"
                        placeholder="Title"
                        label={<VisuallyHidden>Title</VisuallyHidden>}
                    />
                    <Text fontSize="xs" color="red.500">
                        {errors.title?.message}
                    </Text>
                    <Textarea
                        isInvalid={!!errors.description}
                        ref={register}
                        name="description"
                        id="publish-description"
                        placeholder="Description"
                        label={
                            <VisuallyHidden>Description</VisuallyHidden>
                        }></Textarea>
                    <Text fontSize="xs" color="red.500">
                        {errors.description?.message}
                    </Text>

                    <Wrap>
                        {fields.map((item, index) => (
                            <WrapItem key={item.id}>
                                <Controller
                                    defaultValue={item.data}
                                    name={`tags[${index}].data`}
                                    control={control}
                                    as={
                                        <Tag
                                            borderRadius="full"
                                            variant="solid"
                                            colorScheme="green">
                                            <TagLabel>{item.data}</TagLabel>
                                            <TagCloseButton
                                                onClick={() => remove(index)}
                                            />
                                        </Tag>
                                    }></Controller>
                            </WrapItem>
                        ))}
                    </Wrap>
                    <Box mt={2}>
                        <TextField
                            isInvalid={!!errors.tags}
                            value={tagInput}
                            onChange={(e) =>
                                setTagInput(e.target.value.toLowerCase())
                            }
                            placeholder="Add a tag"
                            rightAdornment={
                                <IconButton
                                    variant="ghost"
                                    onClick={() => {
                                        if (
                                            !tagInput.length ||
                                            tagSet.current.has(tagInput)
                                        )
                                            return setTagInput("");
                                        tagSet.current.add(tagInput);
                                        append({ data: tagInput });
                                        setTagInput("");
                                    }}
                                    aria-label="Add">
                                    <FontAwesomeIcon icon={faPlus} />
                                </IconButton>
                            }
                        />
                        <Text fontSize="xs" color="red.500">
                            {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-ignore
                                errors.tags?.message
                            }
                        </Text>
                    </Box>
                    <Center mt={2}>
                        <Button
                            isLoading={loading}
                            aria-live="polite"
                            type="submit"
                            colorScheme="blue">
                            Submit
                        </Button>
                    </Center>
                </Container>
            </form>
        </>
    );
};
export default PublishPage;
