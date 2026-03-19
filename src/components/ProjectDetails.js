import React from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Text, Heading, Button } from "@chakra-ui/react";
import DetailTemplate from "./DetailTemplate"; // 引入共用模板

const ProjectDetails = ({ projects }) => {
    const { id } = useParams(); // 獲取 URL 中的 id
    // const project = projects[parseInt(index)]; // 根據 index 獲取對應的專案資料
    const project = projects.find((project) => project.id === id); // 根據 id 找到對應專案


    if (!project) {
        return (
            <Box textAlign="center" mt="120px" px={8}>
                <Heading size="lg" mb={4}>404 - Project Not Found</Heading>
                <Text color="gray.500" mb={6}>The project you're looking for doesn't exist.</Text>
                <Button as={Link} to="/projects" colorScheme="teal">Back to Projects</Button>
            </Box>
        );
    }

    return (
        <DetailTemplate
            title={project.title}
            description={project.description}
            category={project.category}
            tags={project.tags}
            images={project.images}
            image={project.image}
            reference={project.reference}
            repo={project.repo}
            index={id}
            backLink="/projects"
            backLabel="Projects"
        />
    );
};

export default ProjectDetails;