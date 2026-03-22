import React from "react";
import { Box, VStack, Heading, Text, SimpleGrid } from "@chakra-ui/react";

const accentColors = ["#c0c1ff", "#5de6ff", "#ffb783", "#c0c1ff"];

const EducationSection = ({ educationData }) => (
  <Box
    as="section"
    bg="#171f33"
    py={{ base: 16, md: 24 }}
    px={{ base: 4, md: 8 }}
  >
    <Box maxW="900px" mx="auto">

      {/* Header */}
      <Box mb={{ base: 10, md: 14 }} textAlign="center">
        <Text
          fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
          textTransform="uppercase" mb={3} style={{ color: "#5de6ff" }}
        >
          Academic
        </Text>
        <Heading
          as="h2"
          fontFamily="var(--font-headline)" fontWeight="800"
          fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
          style={{ color: "#dae2fd" }}
          id="education-section"
        >
          Education
        </Heading>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        {educationData.map((item, index) => (
          <Box
            key={index}
            bg="#131b2e"
            borderRadius="16px"
            border="1px solid #464554"
            borderLeft="3px solid"
            borderLeftColor={accentColors[index % accentColors.length]}
            p={6}
            transition="border-color 0.25s, transform 0.25s"
            _hover={{
              borderColor: "#c0c1ff",
              transform: "translateY(-3px)",
            }}
          >
            <VStack align="flex-start" spacing={3}>
              <Box
                w="32px" h="32px" borderRadius="md"
                display="flex" alignItems="center" justifyContent="center"
                bg={`${accentColors[index % accentColors.length]}18`}
                border={`1px solid ${accentColors[index % accentColors.length]}40`}
              >
                <Text fontSize="14px">🎓</Text>
              </Box>
              <Heading
                as="h3"
                fontFamily="var(--font-headline)"
                fontWeight="800"
                fontSize="md"
                style={{ color: "#dae2fd" }}
              >
                {item.school}
              </Heading>
              <Text
                fontFamily="var(--font-body)"
                fontWeight={600}
                fontSize="sm"
                style={{ color: accentColors[index % accentColors.length] }}
              >
                {item.major}
              </Text>
              <Text
                fontFamily="var(--font-label)"
                fontSize="xs"
                letterSpacing="wide"
                style={{ color: "#908fa0" }}
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

export default EducationSection;
