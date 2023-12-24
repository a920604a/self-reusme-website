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
    Image
} from "@chakra-ui/react";
import Card from "./Card";
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Stack, HStack, VStack } from '@chakra-ui/react';
import { FaCode, FaToolbox, } from "react-icons/fa";
import { SiFramework } from "react-icons/si";

const getRandomColor = () => {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};


const skills = [
    {
        "name": "Python",
        "level": "70%"
    },
    {
        "name": "C#",
        "level": "80%"
    },
    {
        "name": "C++",
        "level": "50%"
    },
    {
        "name": "JavaScript",
        "level": "15%"
    },
];

const tools = ['Git', 'SQL', 'Unity', 'Figma', 'Docker', 'Ansible', 'Airflow', 'Ubuntu']
const frameworks = ['React', 'Django', 'Pytoch']
const tryLearn = ['Flask', 'Vue', 'K8s', 'Kafka']



const SkillSection = () => {

    const skillBars = skills.map((skill) => {
        const backgroundColor = "#4FD1C5"; // You can set the color based on your design
        const width = skill.level;

        return (
            <>
                <Text fontSize="md" fontWeight="bold" color="white">
                    {skill.name}
                </Text>
                <Text fontSize="sm" color="white">
                    {skill.level}
                </Text>
                <GridItem
                    key={skill.name}
                    w='100%'
                    colSpan={2}
                    h="10"
                    bg={backgroundColor}
                    style={{ width }}
                >
                </GridItem>

            </>
        );
    });


    const skill = skills.map((skill) => {
        const width = skill.level;
        return (

            // <Text key={skill.name} style={{ color: 'white' }}>
            //     <li key={skill.name}>
            //         <em>{skill.name}</em>
            //     </li>
            // </Text>
            <li key={skill.name}>
                <em>{skill.name}</em>
            </li>
        );
    });


    return (
        <FullScreenSection
            backgroundColor="#512DA8"
            isDarkBackground
            p={8}
            alignItems="flex-start"
            spacing={8}
        >
            <Heading as="h1" id="skills-section">
                Skills
            </Heading>

            <HStack spacing={60}>
                <HStack spacing={4}>
                    <FaCode />
                    <Grid c="repeat(5, 1fr)" gap={4}>
                        {skillBars}
                    </Grid>

                </HStack>
                <HStack spacing={4}>

                    <FaToolbox />
                    <Stack>
                        <List spacing={3}>
                            <h2>Tools</h2>

                            {tools.map((tool, index) => (
                                <ListItem key={index}>
                                    <ListIcon as={CheckCircleIcon} color='blue.500' />
                                    {tool}
                                </ListItem>
                            ))}
                        </List>
                    </Stack>
                </HStack>
                <HStack spacing={4}>


                    <SiFramework />
                    <Stack>
                        <List spacing={3}>
                            <h2>Frameworks</h2>
                            {frameworks.map((framework, index) => (
                                <ListItem key={index}>
                                    <ListIcon as={CheckCircleIcon} color='blue.500' />
                                    {framework}
                                </ListItem>
                            ))}
                        </List>
                    </Stack>
                </HStack>
            </HStack>
        </FullScreenSection >
    );
};

export default SkillSection;
