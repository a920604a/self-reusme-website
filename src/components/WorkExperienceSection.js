import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Text, Heading, VStack } from "@chakra-ui/react";
import Card from "./Card";


const works = [
    {
        title: "Oomii Inc.",
        description:
            ['Develop Unity app. and Integrate eye-tracking, and then deploy by Ansible',
                'Assist to deployment remote meeting\'s prototype',
                'Collaborated with a UI/UX designer to ensure that the designs created in Figma are implemented seamlessly on the actual application',
                'Assisted in evaluating technical skills of candidates during interviews',
                'Build meeting room system so that connect from remote user.',
        ],
    },
    {
        title: "安智聯科技有限公司",
        description:
            ['Successfully implemented and deployed advanced object detection and image classification algorithms for real-world applications.',
                'Collaborated with cross-functional teams to understand client requirements and tailored AI solutions to meet specific needs.',
                'Developed a robust web backend for seamless integration of AI applications into client sites, ensuring efficient data flow and system compatibility.',
                'Stayed updated on the latest trends in AI integration and web development to contribute to the continuous improvement of solutions.'],
    },
    {
        title: "Asus Inc. AICS department",
        description:
            "Maintain ETL pipelines by Airflow that would do the daily sync millions of records from/to different types of dataset",
    },
    {
        title: "FOXCONN - SOFTWARE ENGINEERING INTERN",
        description:
            "Conducted thorough research on machine learning techniques, exploring and implementing cutting-edge models.",
    },
];

const WorkExperienceSection = () => {
    return (
        <FullScreenSection
            backgroundColor="#88f2d6"
            p={8}
            alignItems="flex-start"
            spacing={8}
        >
            <Heading as="h1" id="work-experience-section">
                Work Experience
            </Heading>

            {works.map((work, index) => (

                <VStack key={index} style={{
                    padding: '10px',
                }} alignItems="flex-start">

                    <Heading size="md">{work.title}</Heading>

                    {Array.isArray(work.description) ? (
                        <VStack alignItems="flex-start">
                            {work.description.map((desc, i) => (
                                <Text key={i} style={{ color: 'gray' }}>
                                    {desc}
                                </Text>
                            ))}
                        </VStack>
                    ) : (
                        <Text style={{ color: 'gray' }}>{work.description}</Text>
                    )}


                </VStack>

            ))}


        </FullScreenSection >
    );
};

export default WorkExperienceSection;
