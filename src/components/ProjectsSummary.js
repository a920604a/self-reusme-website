import React from "react";
import {
  Box, Heading, Text, Tag, TagLabel, Stack, Image, SimpleGrid, useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const ProjectsSummary = ({ projects }) => {
  const navigate = useNavigate();
  const bgElevated   = useColorModeValue("#FFFFFF", "#2C2C2E");
  const bgFill       = useColorModeValue("rgba(120,120,128,0.2)", "rgba(120,120,128,0.36)");
  const bgThumb      = useColorModeValue("#F2F2F7", "#1C1C1E");
  const labelPrimary = useColorModeValue("#000000", "#FFFFFF");
  const labelSecond  = useColorModeValue("rgba(60,60,67,0.6)", "rgba(235,235,245,0.6)");
  const labelTertiary = useColorModeValue("rgba(60,60,67,0.3)", "rgba(235,235,245,0.3)");
  const accent       = useColorModeValue("#007AFF", "#0A84FF");
  const accentSoft   = useColorModeValue("rgba(0,122,255,0.06)", "rgba(10,132,255,0.08)");
  const borderColor  = useColorModeValue("#C6C6C8", "#38383A");

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {projects.map((project) => (
        <Box
          key={project.id}
          bg={bgElevated}
          borderRadius="16px"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
          cursor="pointer"
          role="group"
          onClick={() => navigate(`/projects/${project.id}`)}
          transition="border-color 0.25s, transform 0.25s, box-shadow 0.25s"
          _hover={{
            borderColor: accent,
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(0,122,255,0.08)",
          }}
        >
          {/* Thumbnail */}
          {(project.images?.[0] || project.image) && (
            <Box overflow="hidden" h="160px" bg={bgThumb}>
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
                fallback={<Box w="100%" h="160px" bg={bgThumb} />}
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
              style={{ color: accent }}
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
              style={{ color: labelPrimary }}
            >
              {project.title}
            </Heading>

            <Stack direction="row" flexWrap="wrap" gap={1} mb={4}>
              {project.tags.slice(0, 4).map((tag, i) => (
                <Tag key={i} size="sm" borderRadius="full" px={2}
                  bg={bgFill} color={labelSecond} border="1px solid" borderColor={borderColor}
                  fontSize="xs" fontFamily="var(--font-label)">
                  <TagLabel>{tag}</TagLabel>
                </Tag>
              ))}
              {project.tags.length > 4 && (
                <Tag size="sm" borderRadius="full" px={2}
                  bg={bgFill} color={labelTertiary} border="1px solid" borderColor={borderColor} fontSize="xs">
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
              style={{ color: accent, textDecoration: "none" }}
              onClick={(e) => e.stopPropagation()}
              _hover={{ opacity: 0.7 }}
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
