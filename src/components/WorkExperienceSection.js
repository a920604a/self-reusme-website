import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Text, Heading, VStack } from "@chakra-ui/react";
import Card from "./Card";



const WorkExperienceSection = ({works}) => {
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

                    <Heading size="xl" >{work.company}</Heading>
                    <Heading size="md" >{work.position}, {work.years}</Heading>

                    {Array.isArray(work.description) ? (
                        <VStack alignItems="flex-start">
                            {work.description.map((desc, i) => (
                                <Text key={i} style={{ color: 'gray' }}>
                                    <li>{desc}</li>
                                </Text>
                            ))}
                        </VStack>
                    ) : (
                        <Text style={{ color: 'gray' }}><li>{work.description}</li></Text>
                    )}


                </VStack>

            ))}


        </FullScreenSection >
    );
};

export default WorkExperienceSection;
