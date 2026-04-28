import React from "react";
import {
  Box, Heading, Text, VStack, Flex, Badge,
  Link as ChakraLink, useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useLocaleContext } from "../context/LocaleContext";

const WorksSummary = ({ works }) => {
  const { t } = useLocaleContext();
  const navigate = useNavigate();
  const bgCanvas    = useColorModeValue("#FFFFFF", "#000000");
  const bgElevated  = useColorModeValue("#FFFFFF", "#2C2C2E");
  const labelPrimary  = useColorModeValue("#000000", "#FFFFFF");
  const labelSecond   = useColorModeValue("rgba(60,60,67,0.6)", "rgba(235,235,245,0.6)");
  const labelTertiary = useColorModeValue("rgba(60,60,67,0.3)", "rgba(235,235,245,0.3)");
  const accent        = useColorModeValue("#007AFF", "#0A84FF");
  const accentSoft    = useColorModeValue("rgba(0,122,255,0.12)", "rgba(10,132,255,0.2)");
  const borderColor   = useColorModeValue("#C6C6C8", "#38383A");
  const bgFill        = useColorModeValue("rgba(120,120,128,0.2)", "rgba(120,120,128,0.36)");

  return (
    <Box as="section" bg={bgCanvas} py={{ base: 16, md: 24 }} px={{ base: 4, md: 8 }}>
      <Box maxW="900px" mx="auto">

        {/* Section header */}
        <Box mb={{ base: 10, md: 14 }} textAlign="center">
          <Text
            fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
            textTransform="uppercase" mb={3} style={{ color: accent }}
          >
            {t('works.eyebrow') || 'Career'}
          </Text>
          <Heading
            fontFamily="var(--font-headline)" fontWeight="800"
            fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
            style={{ color: labelPrimary }} id="work-experience-section"
          >
            {t('works.title') || 'Work Experience'}
          </Heading>
        </Box>

        {/* Timeline */}
        <VStack spacing={0} align="stretch" position="relative">
          {/* Vertical line */}
          <Box className="timeline-line" />

          {works.map((work, index) => {
            const isCurrent = work.years && work.years.includes("Now");
            return (
              <Flex key={index} pl="36px" pb={index < works.length - 1 ? 10 : 0} position="relative">

                {/* Timeline dot */}
                <Box
                  position="absolute"
                  left="5px"
                  top="6px"
                  w="14px"
                  h="14px"
                  borderRadius="full"
                  border="2px solid"
                  borderColor={isCurrent ? "#c0c1ff" : "#464554"}
                  bg={isCurrent ? "#c0c1ff" : "#0b1326"}
                  zIndex={1}
                  flexShrink={0}
                />

                {/* Card */}
                <Box
                  flex="1"
                  bg={bgElevated}
                  borderRadius="16px"
                  border="1px solid"
                  borderColor={borderColor}
                  borderLeft={isCurrent ? `3px solid ${accent}` : `1px solid ${borderColor}`}
                  p={6}
                  cursor="pointer"
                  transition="border-color 0.25s, transform 0.25s"
                  _hover={{
                    borderColor: accent,
                    transform: "translateY(-3px)",
                  }}
                  onClick={() => navigate(`/works/${work.id}`)}
                >
                  <Flex justify="space-between" align="flex-start" wrap="wrap" gap={2} mb={3}>
                    <Flex align="center" gap={3}>
                      <Heading
                        fontFamily="var(--font-headline)"
                        fontWeight="800"
                        fontSize="md"
                        style={{ color: accent }}
                      >
                        {work.company}
                      </Heading>
                    </Flex>
                    <Badge
                      px={3} py={1} borderRadius="full" fontSize="xs"
                      fontFamily="var(--font-label)"
                      bg={isCurrent ? accentSoft : bgFill}
                      style={{ color: isCurrent ? accent : labelTertiary }}
                      border={`1px solid ${isCurrent ? accent : borderColor}`}
                    >
                      {work.years}
                    </Badge>
                  </Flex>

                  <Text
                    fontFamily="var(--font-body)"
                    fontSize="sm"
                    fontStyle="italic"
                    mb={3}
                    style={{ color: accent }}
                  >
                    {work.position}
                  </Text>

                  <Text
                    fontFamily="var(--font-body)"
                    fontSize="sm"
                    lineHeight="1.75"
                    mb={4}
                    style={{ color: labelSecond }}
                    noOfLines={3}
                  >
                    {work.description}
                  </Text>

                  <ChakraLink
                    as={Link}
                    to={`/works/${work.id}`}
                    fontFamily="var(--font-headline)"
                    fontWeight="700"
                    fontSize="xs"
                    letterSpacing="wide"
                    style={{ color: accent, textDecoration: "none" }}
                    _hover={{ color: labelPrimary, textDecoration: "none" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t('works.viewDetails') || 'View Details →'}
                  </ChakraLink>
                </Box>
              </Flex>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
};

export default WorksSummary;
