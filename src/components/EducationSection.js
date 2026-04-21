import React from "react";
import { Box, VStack, Heading, Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";

const EducationSection = ({ educationData }) => {
  const bgSection    = useColorModeValue("#F2F2F7", "#1C1C1E");
  const bgElevated   = useColorModeValue("#FFFFFF", "#2C2C2E");
  const labelPrimary = useColorModeValue("#000000", "#FFFFFF");
  const labelSecond  = useColorModeValue("rgba(60,60,67,0.6)", "rgba(235,235,245,0.6)");
  const accent       = useColorModeValue("#007AFF", "#0A84FF");
  const borderColor  = useColorModeValue("#C6C6C8", "#38383A");

  return (
    <Box
      as="section"
      bg={bgSection}
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
    >
      <Box maxW="900px" mx="auto">

        {/* Header */}
        <Box mb={{ base: 10, md: 14 }} textAlign="center">
          <Text
            fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
            textTransform="uppercase" mb={3} style={{ color: accent }}
          >
            Academic
          </Text>
          <Heading
            as="h2"
            fontFamily="var(--font-headline)" fontWeight="800"
            fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
            style={{ color: labelPrimary }}
            id="education-section"
          >
            Education
          </Heading>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          {educationData.map((item, index) => (
            <Box
              key={index}
              bg={bgElevated}
              borderRadius="16px"
              border="1px solid"
              borderColor={borderColor}
              borderLeft="3px solid"
              borderLeftColor={accent}
              p={6}
              transition="border-color 0.25s, transform 0.25s"
              _hover={{
                borderColor: accent,
                transform: "translateY(-3px)",
              }}
            >
              <VStack align="flex-start" spacing={3}>
                <Box
                  w="32px" h="32px" borderRadius="md"
                  display="flex" alignItems="center" justifyContent="center"
                  bg="rgba(0,122,255,0.1)"
                  border="1px solid rgba(0,122,255,0.2)"
                >
                  <Text fontSize="14px">🎓</Text>
                </Box>
                <Heading
                  as="h3"
                  fontFamily="var(--font-headline)"
                  fontWeight="800"
                  fontSize="md"
                  style={{ color: labelPrimary }}
                >
                  {item.school}
                </Heading>
                <Text
                  fontFamily="var(--font-body)"
                  fontWeight={600}
                  fontSize="sm"
                  style={{ color: accent }}
                >
                  {item.major}
                </Text>
                <Text
                  fontFamily="var(--font-label)"
                  fontSize="xs"
                  letterSpacing="wide"
                  style={{ color: labelSecond }}
                >
                  {item.duration}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default EducationSection;
