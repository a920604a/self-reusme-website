import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Avatar, Heading, VStack } from "@chakra-ui/react";

const details = {
    title:"title01",
    


};
const ProjectDetails = () => {
    return (
        <FullScreenSection
            backgroundColor="#14532d"
            isDarkBackground
            p={8}
            alignItems="flex-start"
            spacing={8}
        >
            <br />
            <Heading as="h1" id="projects-section">
                Project Details
            </Heading>
        </FullScreenSection>
    );
};

export default ProjectDetails;