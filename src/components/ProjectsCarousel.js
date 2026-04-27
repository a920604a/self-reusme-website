import React from "react";
import {
  Box, Heading, Text, Image, Flex, VStack, Stack,
  Tag, TagLabel, Link as ChakraLink, useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useLocaleContext } from "../context/LocaleContext";

const ProjectsCarousel = ({ projects }) => {
  const { t } = useLocaleContext();
  const bgSection    = useColorModeValue("#F2F2F7", "#1C1C1E");
  const bgElevated   = useColorModeValue("#FFFFFF", "#2C2C2E");
  const bgFill       = useColorModeValue("rgba(120,120,128,0.2)", "rgba(120,120,128,0.36)");
  const labelPrimary = useColorModeValue("#000000", "#FFFFFF");
  const labelSecond  = useColorModeValue("rgba(60,60,67,0.6)", "rgba(235,235,245,0.6)");
  const labelTertiary = useColorModeValue("rgba(60,60,67,0.3)", "rgba(235,235,245,0.3)");
  const accent       = useColorModeValue("#007AFF", "#0A84FF");
  const accentSoft   = useColorModeValue("rgba(0,122,255,0.07)", "rgba(10,132,255,0.07)");
  const borderColor  = useColorModeValue("#C6C6C8", "#38383A");

  return (
    <Box as="section" bg={bgSection} py={{ base: 16, md: 24 }} px={{ base: 4, md: 8 }}>
      <Box maxW="1100px" mx="auto">

        {/* Section header */}
        <Box mb={{ base: 12, md: 16 }} textAlign="center">
          <Text
            fontFamily="var(--font-label)"
            fontSize="xs"
            letterSpacing="widest"
            textTransform="uppercase"
            mb={3}
            style={{ color: accent }}
          >
            {t('projects.eyebrow') || 'Selected Work'}
          </Text>
          <Heading
            fontFamily="var(--font-headline)"
            fontWeight="800"
            fontSize={{ base: "2xl", md: "3xl" }}
            letterSpacing="-0.02em"
            style={{ color: labelPrimary }}
            id="projects-section"
          >
            {t('projects.title') || 'Featured Projects'}
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
                    border="1px solid"
                    borderColor={borderColor}
                    role="group"
                    transition="border-color 0.3s ease"
                    _hover={{ borderColor: accent }}
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
                      bg={bgElevated}
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
                  style={{ color: accent }}
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
                  style={{ color: labelPrimary }}
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
                      bg={bgFill}
                      color={labelSecond}
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  ))}
                  {project.tags.length > 5 && (
                    <Tag size="sm" borderRadius="full" px={3} bg={bgFill} color={labelTertiary} border="1px solid" borderColor={borderColor}>
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
                  style={{ color: accent, textDecoration: "none" }}
                  _hover={{ opacity: 0.7, textDecoration: "none" }}
                >
                  {t('projects.viewDetails') || 'View Project →'}
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
            borderRadius="12px"
            border="1px solid"
            borderColor={accent}
            fontFamily="var(--font-headline)"
            fontWeight="700"
            fontSize="sm"
            letterSpacing="wide"
            style={{ color: accent, textDecoration: "none" }}
            _hover={{ bg: accentSoft, textDecoration: "none" }}
            transition="background 0.2s"
          >
            {t('projects.viewAll') || 'View All Projects →'}
          </ChakraLink>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectsCarousel;
