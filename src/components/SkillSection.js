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
// import { FaCode, FaToolbox } from "react-icons/fa";
// import { SiFramework } from "react-icons/si";
import { FaGitAlt, FaDocker, FaReact } from "react-icons/fa";
import { SiDjango } from "react-icons/si";

// 建立 Icons 對象，將 icon 名稱映射到對應的圖標組件
const Icons = {
    skills: {
        Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
        "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
        JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    tools: {
        Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        MySQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        SQLite: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
        Redis: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",

        MongoDB: "https://raw.githubusercontent.com/devicons/devicon/v2.16.0/icons/mongodb/mongodb-original.svg", // MongoDB 圖標
        Unity: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
        Figma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
        Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        Ansible: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg",
        Airflow: "https://raw.githubusercontent.com/devicons/devicon/refs/tags/v2.16.0/icons/apacheairflow/apacheairflow-original.svg",

        Ubuntu: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg",
    },
    frameworks: {
        React: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        // Django: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
        FastAPI: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",

        // PyTorch (使用 GitHub 圖標 URL)
        Pytoch: "https://pytorch.org/assets/images/pytorch-logo.png",
    },
};

const SkillSection = ({ skills, tools, frameworks }) => {
    return (
        <FullScreenSection backgroundColor="#fffbed" p={8} alignItems="flex-start" spacing={8}>
            <Heading as="h1" id="skills-section" color="black" mb={6}>
                Skills
            </Heading>

            <HStack spacing={60} justify="space-between" align="flex-start" w="100%">
                {/* Skills */}
                <VStack spacing={4} align="flex-start" w="30%">
                    <Heading as="h3" size="md" color="black">
                        Skills
                    </Heading>
                    <List spacing={3} w="100%">
                        {skills.map((skill, index) => (
                            <ListItem key={index} display="flex" alignItems="center">
                                <img
                                    src={Icons.skills[skill.name]}
                                    alt={skill.name}
                                    style={{ width: 24, height: 24, marginRight: 8 }}
                                />
                                <VStack align="flex-start" spacing={1}>
                                    <Text color="black" fontSize="md" fontWeight="bold">
                                        {skill.name}
                                    </Text>
                                    <Progress
                                        value={parseInt(skill.level)}
                                        colorScheme="teal"
                                        size="sm"
                                        hasStripe
                                        isAnimated
                                        w="100%"
                                    />
                                    <Text color="gray.400" fontSize="sm">
                                        {skill.level}
                                    </Text>
                                </VStack>
                            </ListItem>
                        ))}
                    </List>
                </VStack>

                {/* Tools */}
                <VStack spacing={4} align="flex-start" w="30%">
                    <Heading as="h3" size="md" color="black">
                        Tools
                    </Heading>
                    <List spacing={3}>
                        {tools.map((tool, index) => (
                            <ListItem key={index} display="flex" alignItems="center">
                                <img
                                    src={Icons.tools[tool]}
                                    alt={tool}
                                    style={{ width: 24, height: 24, marginRight: 8 }}
                                />
                                <Text color="black" fontSize="md">
                                    {tool}
                                </Text>
                            </ListItem>
                        ))}
                    </List>
                </VStack>

                {/* Frameworks */}
                <VStack spacing={4} align="flex-start" w="30%">
                    <Heading as="h3" size="md" color="black">
                        Frameworks
                    </Heading>
                    <List spacing={3}>
                        {frameworks.map((framework, index) => (
                            <ListItem key={index} display="flex" alignItems="center">
                                <img
                                    src={Icons.frameworks[framework]}
                                    alt={framework}
                                    style={{ width: 24, height: 24, marginRight: 8 }}
                                />
                                <Text color="black" fontSize="md">
                                    {framework}
                                </Text>
                            </ListItem>
                        ))}
                    </List>
                </VStack>
            </HStack>
        </FullScreenSection>
    );
};

export default SkillSection;
