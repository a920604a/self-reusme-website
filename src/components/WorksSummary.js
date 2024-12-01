import React from "react";
import { Box, Heading, Text, VStack, Flex, Link as ChakraLink, Badge } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const WorksSummary = ({ works }) => {
    return (
        <section>
            <Heading as="h2" size="lg" mb={6} id="work-experience-section" textAlign="center">
                Work Experience
            </Heading>
            <VStack spacing={6}>
                {works.map((work, index) => (
                    <Box
                        key={index}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={5}
                        boxShadow="lg"
                        transition="all 0.2s"
                        _hover={{ boxShadow: "2xl", bg: "blue.50" }}
                        w="100%"
                    >
                        <Flex justifyContent="space-between" alignItems="center" mb={2}>
                            <Heading size="md" mb={2} color="blue.700">
                                {work.company}
                            </Heading>
                            <Badge colorScheme="green" fontSize="0.9em">
                                {work.years}
                            </Badge>
                        </Flex>
                        <Text fontSize="lg" mb={4} fontStyle="italic" color="gray.600">
                            {work.position}
                        </Text>
                        <ChakraLink
                            as={Link}
                            to={`/works/${index}`}
                            color="blue.500"
                            fontWeight="bold"
                            _hover={{ textDecoration: "underline" }}
                        >
                            View Details →
                        </ChakraLink>
                    </Box>
                ))}
            </VStack>
        </section>
    );
};

export default WorksSummary;
