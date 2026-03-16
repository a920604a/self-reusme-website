import React from "react";
import { Box, VStack, Heading, Text, SimpleGrid, Icon } from "@chakra-ui/react";
import { FaGraduationCap } from "react-icons/fa";

const EducationSection = ({ educationData }) => {
  return (
    <Box
      as="section"
      bg="#0d2137"
      py={{ base: 12, md: 16 }}
      px={{ base: 4, md: 8, lg: 16 }}
    >
      <Box maxW="1280px" mx="auto">
        <Heading as="h2" size="lg" mb={2} id="education-section" textAlign="center" color="white" fontWeight={700}>
          Education
        </Heading>
        <Text textAlign="center" color="whiteAlpha.600" mb={10} fontSize="sm">
          Academic background
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          {educationData.map((item, index) => (
            <Box
              key={index}
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.200"
              borderRadius="12px"
              p={6}
              transition="all 0.25s ease"
              _hover={{
                bg: "whiteAlpha.150",
                borderColor: "teal.400",
                transform: "translateY(-2px)",
              }}
            >
              <VStack align="flex-start" spacing={3}>
                <Icon as={FaGraduationCap} color="teal.300" boxSize={6} />
                <Heading as="h3" size="md" color="white" fontWeight={700}>
                  {item.school}
                </Heading>
                <Text fontWeight={600} fontSize="sm" color="teal.300">
                  {item.major}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.600">
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
