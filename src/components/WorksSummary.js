import React from "react";
import {
  Box, Heading, Text, VStack, Flex, Badge,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const WorksSummary = ({ works }) => {
  const navigate = useNavigate();

  return (
    <Box as="section" bg="#0b1326" py={{ base: 16, md: 24 }} px={{ base: 4, md: 8 }}>
      <Box maxW="900px" mx="auto">

        {/* Section header */}
        <Box mb={{ base: 10, md: 14 }} textAlign="center">
          <Text
            fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
            textTransform="uppercase" mb={3} style={{ color: "#5de6ff" }}
          >
            Career
          </Text>
          <Heading
            fontFamily="var(--font-headline)" fontWeight="800"
            fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
            style={{ color: "#dae2fd" }} id="work-experience-section"
          >
            Work Experience
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
                  bg="#171f33"
                  borderRadius="16px"
                  border="1px solid #464554"
                  borderLeft={isCurrent ? "3px solid #c0c1ff" : "1px solid #464554"}
                  p={6}
                  cursor="pointer"
                  transition="border-color 0.25s, transform 0.25s"
                  _hover={{
                    borderColor: "#c0c1ff",
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
                        style={{ color: "#c0c1ff" }}
                      >
                        {work.company}
                      </Heading>
                    </Flex>
                    <Badge
                      px={3} py={1} borderRadius="full" fontSize="xs"
                      fontFamily="var(--font-label)"
                      bg={isCurrent ? "rgba(192,193,255,0.12)" : "#222a3d"}
                      style={{ color: isCurrent ? "#c0c1ff" : "#908fa0" }}
                      border={`1px solid ${isCurrent ? "rgba(192,193,255,0.3)" : "#464554"}`}
                    >
                      {work.years}
                    </Badge>
                  </Flex>

                  <Text
                    fontFamily="var(--font-body)"
                    fontSize="sm"
                    fontStyle="italic"
                    mb={3}
                    style={{ color: "#5de6ff" }}
                  >
                    {work.position}
                  </Text>

                  <Text
                    fontFamily="var(--font-body)"
                    fontSize="sm"
                    lineHeight="1.75"
                    mb={4}
                    style={{ color: "#c7c4d7" }}
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
                    style={{ color: "#5de6ff", textDecoration: "none" }}
                    _hover={{ color: "#c0c1ff", textDecoration: "none" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details →
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
