import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading } from "@chakra-ui/react";
import Card from "./Card";
const projects = [
  {
    title: "Age-related Macular Degeneration Rehabilitation Platform",
    description:
      "Successfully developed and integrated a comprehensive medical management platform with multiple technologies, including Unity, SQL, C# and Eye Tracking technology.",
    // getImageSrc: () => require("../images/photo1.jpg"),
  },
  {
    title: "Remote meeting prototype",
    description:
      "Use Photon and C# to jointly develop a remote video conference prototype",
    // getImageSrc: () => require("../images/photo2.jpg"),
  }
];

const ProjectsSection = () => {
  return (
    <FullScreenSection
      backgroundColor="#14532d"
      isDarkBackground
      p={8}
      alignItems="flex-start"
      spacing={8}
      minHeight="50vh"
    >
      <Heading as="h1" id="projects-section">
        Featured Projects
      </Heading>
      <Box
        display="grid"
        gridTemplateColumns="repeat(2,minmax(0,1fr))"
        gridGap={8}
      >
        {projects.map((project) => (
          <Card
            key={project.title}
            title={project.title}
            description={project.description}
          />
        ))}
      </Box>
    </FullScreenSection>
  );
};

export default ProjectsSection;
