import React from "react";
import FullScreenSection from "./FullScreenSection";
import {
    Center, Heading, List,
    ListItem,
    ListIcon,
    Image
} from "@chakra-ui/react";
import Card from "./Card";
import { PhoneIcon, AddIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { Stack, HStack, VStack } from '@chakra-ui/react';


const skills = ['C#', 'Python', 'C++'];

const tools = ['Git', 'SQL', 'Unity', 'Figma', 'Docker', 'Ansible', 'Airflow', 'Ubuntu']
const frameworks = ['React', 'Django', 'Pytoch']
const tryLearn = ['Flask', 'Vue', 'K8s', 'Kafka']



const SkillSection = () => {
    return (
        <FullScreenSection
            backgroundColor="#512DA8"
            isDarkBackground
            p={8}
            alignItems="flex-start"
            spacing={8}
            minHeight="50vh"
        >
            <Heading as="h1" id="skills-section">
                Skills
            </Heading>


            <Stack direction={['column', 'row']} spacing={12} align='start'>


                <Image
                    objectFit='cover'
                    src={require("../images/code_blocks.png")}
                    alt={"Skills"}
                    borderRadius="10px"
                />
                <List spacing={3}>
                    <h2>Skills</h2>


                    {skills.map((skill, index) => (
                        <ListItem key={index}>
                            <ListIcon as={CheckCircleIcon} color='blue.500' />
                            {skill}
                        </ListItem>
                    ))}
                </List>

                <Image
                    objectFit='cover'
                    src={require("../images/tools.png")}
                    alt={"Skills"}
                    borderRadius="10px"
                />
                <List spacing={3}>
                    <h2>Tools</h2>

                    {tools.map((tool, index) => (
                        <ListItem key={index}>
                            <ListIcon as={CheckCircleIcon} color='blue.500' />
                            {tool}
                        </ListItem>
                    ))}
                </List>
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
        </FullScreenSection>
    );
};

export default SkillSection;
