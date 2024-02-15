import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading } from "@chakra-ui/react";
import Card from "./Card";

const ProjectsSection = ({ projects }) => {
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
            // imageSrc={() => require(project.getImageSrc)}
            imageSrc={"images/portfolio/" + project.image}
          // imageSrc={`../images/${project.image}`}
          />
        ))}
      </Box>
    </FullScreenSection>
  );
};

export default ProjectsSection;
