import React from "react";
import { Box, Heading, Text, Tag, TagLabel, Stack, Link as ChakraLink, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const DetailTemplate = ({ title, subtitle, category, description, tags, image, reference, repo, index, backLink }) => {
    return (
        <Box p={8} backgroundColor="#ffffff" isdarkbackground="true" spacing={8}>
            <Heading as="h1" id={`details-${index}`} mb={6}>
                {title}
            </Heading>

            {category && (
                <Text fontSize="lg" color="black" mb={4}>
                    {subtitle}
                </Text>
            )}

            {subtitle && (
                <Text fontSize="lg" color="black" mb={4}>
                    {subtitle}
                </Text>
            )}

            <Stack direction="row" spacing={2} mb={4}>
                {tags && tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex} colorScheme="teal" size="sm">
                        <TagLabel>{tag}</TagLabel>
                    </Tag>
                ))}
            </Stack>

            <Text fontSize="md" color="black" mb={6}>
                {description.length > 0 ? description.join(" ") : "No description available."}
            </Text>

            {image && (
                <Image
                    src={`images/portfolio/${image}`}
                    alt={title}
                    objectFit="cover"
                    height="300px"
                    width="100%"
                    mb={6}
                />
            )}

            {reference && (
                <ChakraLink
                    href={reference}
                    isExternal
                    color="blue.500"
                    fontWeight="bold"
                    _hover={{ textDecoration: "underline" }}
                    mb={4}
                >
                    Reference Link
                </ChakraLink>
            )}

            {repo && (
                <ChakraLink
                    href={repo}
                    isExternal
                    color="blue.500"
                    fontWeight="bold"
                    _hover={{ textDecoration: "underline" }}
                    mb={4}
                >
                    View Repository
                </ChakraLink>
            )}

            <ChakraLink
                as={Link}
                to={backLink || "/"}
                color="blue.500"
                fontWeight="bold"
                _hover={{ textDecoration: "underline" }}
            >
                Back to List
            </ChakraLink>
        </Box>
    );
};

export default DetailTemplate;
