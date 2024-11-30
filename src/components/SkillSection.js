import React from "react";
import FullScreenSection from "./FullScreenSection";
import {
    Center, Heading, List,
    Text,
    Box,
    ListItem,
    ListIcon,
    Grid,
    GridItem,
    Flex,
    Image,
    Progress
} from "@chakra-ui/react";
import Card from "./Card";
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Stack, HStack, VStack } from '@chakra-ui/react';
import { FaCode, FaToolbox } from "react-icons/fa";
import { SiFramework } from "react-icons/si";

const SkillSection = ({ skills, tools, frameworks }) => {
    return (
        <FullScreenSection
            backgroundColor="#512DA8"
            isdarkbackground="true"
            p={8}
            alignItems="flex-start"
            spacing={8}
        >
            <Heading as="h1" id="skills-section" color="white" mb={6}>
                Skills
            </Heading>

            <HStack spacing={60} justify="space-between" align="flex-start" w="100%">
                {/* Skill Bars */}
                <VStack spacing={4} align="flex-start" w="30%">
                    <HStack spacing={2} align="center">
                        <FaCode color="#4FD1C5" size={24} />
                        <Heading as="h3" size="md" color="white">
                            Code Language
                        </Heading>
                    </HStack>
                    <List spacing={4} w="100%">
                        {skills.map((skill, index) => (
                            <ListItem key={index}>
                                <Box>
                                    <Text fontSize="lg" fontWeight="bold" color="white">
                                        {skill.name}
                                    </Text>
                                    <Progress
                                        value={parseInt(skill.level)}
                                        colorScheme="teal"
                                        size="sm"
                                        hasStripe
                                        isAnimated
                                        mb={2}
                                    />
                                    <Text fontSize="sm" color="gray.400">{skill.level}</Text>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </VStack>

                {/* Tools */}
                <VStack spacing={4} align="flex-start" w="30%">
                    <HStack spacing={2} align="center">
                        <FaToolbox color="#4FD1C5" size={24} />
                        <Heading as="h3" size="md" color="white">
                            Tools
                        </Heading>
                    </HStack>
                    <List spacing={3}>
                        {tools.map((tool, index) => (
                            <ListItem key={index} display="flex" alignItems="center">
                                <ListIcon as={CheckCircleIcon} color="blue.500" />
                                <Text color="white" fontSize="md">{tool}</Text>
                            </ListItem>
                        ))}
                    </List>
                </VStack>

                {/* Frameworks */}
                <VStack spacing={4} align="flex-start" w="30%">
                    <HStack spacing={2} align="center">
                        <SiFramework color="#4FD1C5" size={24} />
                        <Heading as="h3" size="md" color="white">
                            Frameworks
                        </Heading>
                    </HStack>
                    <List spacing={3}>
                        {frameworks.map((framework, index) => (
                            <ListItem key={index} display="flex" alignItems="center">
                                <ListIcon as={CheckCircleIcon} color="blue.500" />
                                <Text color="white" fontSize="md">{framework}</Text>
                            </ListItem>
                        ))}
                    </List>
                </VStack>
            </HStack>

        </FullScreenSection>
    );
};

export default SkillSection;
