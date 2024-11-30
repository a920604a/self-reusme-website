import React from "react";
import { Box, Heading, Text, VStack, Stack, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const WorksSummary = ({ works }) => {
    return (
        <section>
            <Heading as="h2" size="lg" mb={6} id="work-experience-section">
                Work Experience
            </Heading>
            <Stack spacing={4}>
                {works.map((work, index) => (
                    <Box
                        key={index}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        boxShadow="sm"
                        _hover={{ boxShadow: "md", bg: "gray.100" }}
                    >
                        <Heading size="md" mb={2}>
                            {work.company}
                        </Heading>
                        <Text fontSize="lg" mb={2}>
                            {work.position}
                        </Text>
                        <ChakraLink
                            as={Link}
                            to={`/works/${index}`}
                            color="blue.500"
                            _hover={{ textDecoration: "underline" }}
                        >
                            View Details
                        </ChakraLink>
                    </Box>
                ))
                }
            </Stack >
        </section >
    );
};



export default WorksSummary;