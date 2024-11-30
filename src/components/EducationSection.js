import React from "react";
import {
    Box,
    VStack,
    Heading,
    Text,
    SimpleGrid,
    Icon,
    useColorModeValue,
} from "@chakra-ui/react";
import { FaGraduationCap } from "react-icons/fa";
import FullScreenSection from "./FullScreenSection";

const EducationSection = ({ educationData }) => {
    const cardBg = useColorModeValue("white", "gray.700");
    const cardBorder = useColorModeValue("gray.200", "gray.600");

    return (
        <FullScreenSection
            backgroundColor="#14532d"
            isdarkbackground="true"
            p={8}
            alignItems="flex-start"
            spacing={8}
        >
            <Heading as="h1" id="education-section" color="white" mb={6}>
                Education
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                {educationData.map((item, index) => (
                    <Box
                        key={index}
                        bg={cardBg}
                        border="1px solid"
                        borderColor={cardBorder}
                        borderRadius="lg"
                        p={6}
                        shadow="md"
                    >
                        <VStack align="flex-start" spacing={4}>
                            <Icon as={FaGraduationCap} color="teal.400" boxSize={6} />
                            <Heading as="h3" size="md" color="teal.600">
                                {item.school}
                            </Heading>
                            <Text fontWeight="bold" fontSize="sm" color="gray.500">
                                {item.major}
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                                {item.duration}
                            </Text>
                        </VStack>
                    </Box>
                ))}
            </SimpleGrid>
        </FullScreenSection>
    );
};

export default EducationSection;
