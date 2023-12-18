import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading } from "@chakra-ui/react";
import Card from "./Card";
const projects = [
  {
    title: "AMD",
    description:
      "Successfully developed and integrated a comprehensive medical management platform with multiple technologies, including Unity, SQL, C# and Eye Tracking technology.",
    // getImageSrc: () => require("../images/photo1.jpg"),
    url: "projects",
  },
  {
    title: "Remote meeting",
    description:
      "Use Photon and C# to jointly develop a remote video conference prototype",
    // getImageSrc: () => require("../images/photo2.jpg"),
    url: "projects",
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
            // imageSrc={project.getImageSrc()}
            url={project.url}
          />
        ))}
      </Box>
    </FullScreenSection>
  );
};

export default ProjectsSection;
