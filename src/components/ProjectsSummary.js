import React from "react";
import {
  Box, Heading, Text, Tag, TagLabel, Stack, Image, SimpleGrid,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const ProjectsSummary = ({ projects }) => {
  const navigate = useNavigate();

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {projects.map((project) => (
        <Box
          key={project.id}
          bg="#171f33"
          borderRadius="16px"
          border="1px solid #464554"
          overflow="hidden"
          cursor="pointer"
          role="group"
          onClick={() => navigate(`/projects/${project.id}`)}
          transition="border-color 0.25s, transform 0.25s, box-shadow 0.25s"
          _hover={{
            borderColor: "#c0c1ff",
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(192,193,255,0.08)",
          }}
        >
          {/* Thumbnail */}
          {(project.images?.[0] || project.image) && (
            <Box overflow="hidden" h="160px" bg="#0b1326">
              <Image
                src={`${process.env.PUBLIC_URL}/images/portfolio/${
                  project.images?.[0] ?? project.image
                }`}
                alt={project.title}
                objectFit="cover"
                w="100%"
                h="160px"
                transition="transform 0.5s ease"
                _groupHover={{ transform: "scale(1.05)" }}
                fallback={<Box w="100%" h="160px" bg="#0b1326" />}
              />
            </Box>
          )}

          {/* Content */}
          <Box p={5}>
            <Text
              fontFamily="var(--font-label)"
              fontSize="xs"
              letterSpacing="widest"
              textTransform="uppercase"
              mb={2}
              style={{ color: "#5de6ff" }}
            >
              {project.category} · {project.date}
            </Text>

            <Heading
              as="h3"
              fontFamily="var(--font-headline)"
              fontWeight="800"
              fontSize="md"
              letterSpacing="-0.01em"
              mb={3}
              style={{ color: "#c0c1ff" }}
            >
              {project.title}
            </Heading>

            <Stack direction="row" flexWrap="wrap" gap={1} mb={4}>
              {project.tags.slice(0, 4).map((tag, i) => (
                <Tag key={i} size="sm" borderRadius="full" px={2}
                  bg="#222a3d" color="#c7c4d7" border="1px solid #464554"
                  fontSize="xs" fontFamily="var(--font-label)">
                  <TagLabel>{tag}</TagLabel>
                </Tag>
              ))}
              {project.tags.length > 4 && (
                <Tag size="sm" borderRadius="full" px={2}
                  bg="#131b2e" color="#908fa0" border="1px solid #464554" fontSize="xs">
                  <TagLabel>+{project.tags.length - 4}</TagLabel>
                </Tag>
              )}
            </Stack>

            <Text
              as={Link}
              to={`/projects/${project.id}`}
              fontFamily="var(--font-headline)"
              fontWeight="700"
              fontSize="xs"
              letterSpacing="wide"
              style={{ color: "#5de6ff", textDecoration: "none" }}
              onClick={(e) => e.stopPropagation()}
              _hover={{ color: "#c0c1ff" }}
            >
              View Details →
            </Text>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default ProjectsSummary;
