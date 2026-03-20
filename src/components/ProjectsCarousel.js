import React from "react";
import {
  Box, Heading, Text, Image, Flex, VStack, Stack,
  Tag, TagLabel, Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ProjectsCarousel = ({ projects }) => (
  <Box as="section" bg="#131b2e" py={{ base: 16, md: 24 }} px={{ base: 4, md: 8 }}>
    <Box maxW="1100px" mx="auto">

      {/* Section header */}
      <Box mb={{ base: 12, md: 16 }} textAlign="center">
        <Text
          fontFamily="var(--font-label)"
          fontSize="xs"
          letterSpacing="widest"
          textTransform="uppercase"
          mb={3}
          style={{ color: "#5de6ff" }}
        >
          Selected Work
        </Text>
        <Heading
          fontFamily="var(--font-headline)"
          fontWeight="800"
          fontSize={{ base: "2xl", md: "3xl" }}
          letterSpacing="-0.02em"
          style={{ color: "#dae2fd" }}
          id="projects-section"
        >
          Featured Projects
        </Heading>
      </Box>

      {/* Alternating project rows */}
      <VStack spacing={{ base: 16, md: 24 }} align="stretch">
        {projects.map((project, index) => (
          <Flex
            key={project.id}
            direction={{
              base: "column",
              lg: index % 2 === 0 ? "row" : "row-reverse",
            }}
            align="center"
            gap={{ base: 8, lg: 14 }}
          >
            {/* Image */}
            <Box flex="1" minW={0}>
              <Link to={`/projects/${project.id}`} style={{ textDecoration: "none" }}>
                <Box
                  borderRadius="16px"
                  overflow="hidden"
                  border="1px solid #464554"
                  role="group"
                  transition="border-color 0.3s ease"
                  _hover={{ borderColor: "#c0c1ff" }}
                >
                  <Image
                    src={`${process.env.PUBLIC_URL}/images/portfolio/${
                      project.images?.[0] || project.image
                    }`}
                    alt={project.title}
                    w="100%"
                    h={{ base: "200px", md: "280px" }}
                    objectFit="cover"
                    transition="transform 0.5s ease"
                    _groupHover={{ transform: "scale(1.04)" }}
                    bg="#171f33"
                  />
                </Box>
              </Link>
            </Box>

            {/* Content */}
            <Box flex="1" minW={0}>
              <Text
                fontFamily="var(--font-label)"
                fontSize="xs"
                letterSpacing="widest"
                textTransform="uppercase"
                mb={3}
                style={{ color: "#5de6ff" }}
              >
                {project.category} · {project.date}
              </Text>

              <Heading
                as="h3"
                fontFamily="var(--font-headline)"
                fontWeight="800"
                fontSize={{ base: "xl", md: "2xl" }}
                letterSpacing="-0.02em"
                lineHeight="1.2"
                mb={4}
                style={{ color: "#c0c1ff" }}
              >
                {project.title}
              </Heading>

              <Stack direction="row" flexWrap="wrap" gap={2} mb={6}>
                {project.tags.slice(0, 5).map((tag, i) => (
                  <Tag
                    key={i}
                    size="sm"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontFamily="var(--font-label)"
                    bg="#222a3d"
                    color="#c7c4d7"
                    border="1px solid #464554"
                  >
                    <TagLabel>{tag}</TagLabel>
                  </Tag>
                ))}
                {project.tags.length > 5 && (
                  <Tag size="sm" borderRadius="full" px={3} bg="#171f33" color="#908fa0" border="1px solid #464554">
                    <TagLabel>+{project.tags.length - 5}</TagLabel>
                  </Tag>
                )}
              </Stack>

              <ChakraLink
                as={Link}
                to={`/projects/${project.id}`}
                fontFamily="var(--font-headline)"
                fontWeight="700"
                fontSize="sm"
                letterSpacing="wide"
                style={{ color: "#5de6ff", textDecoration: "none" }}
                _hover={{ color: "#c0c1ff", textDecoration: "none" }}
              >
                View Project →
              </ChakraLink>
            </Box>
          </Flex>
        ))}
      </VStack>

      {/* View all */}
      <Box textAlign="center" mt={{ base: 16, md: 20 }}>
        <ChakraLink
          as={Link}
          to="/projects"
          display="inline-block"
          px={8} py={3}
          borderRadius="md"
          border="1px solid #c0c1ff"
          fontFamily="var(--font-headline)"
          fontWeight="700"
          fontSize="sm"
          letterSpacing="wide"
          style={{ color: "#c0c1ff", textDecoration: "none" }}
          _hover={{ bg: "rgba(192,193,255,0.07)", textDecoration: "none" }}
          transition="background 0.2s"
        >
          View All Projects →
        </ChakraLink>
      </Box>
    </Box>
  </Box>
);

export default ProjectsCarousel;
