import React from "react";
import { Avatar, Heading, Text, Button, VStack, Box, Badge } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa";

const LandingSection = ({ greeting, bio1, bio2, resumeDownload }) => (
  <Box
    as="section"
    id="main-content"
    minH="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bgGradient="linear(to-br, #0f172a 0%, #1a3a5c 60%, #0f172a 100%)"
    pt="80px"
    px={4}
    position="relative"
    overflow="hidden"
  >
    {/* Decorative glow circles */}
    <Box
      position="absolute"
      top="-100px"
      right="-100px"
      w="400px"
      h="400px"
      borderRadius="full"
      bg="teal.600"
      opacity={0.07}
      filter="blur(80px)"
      pointerEvents="none"
    />
    <Box
      position="absolute"
      bottom="-80px"
      left="-80px"
      w="300px"
      h="300px"
      borderRadius="full"
      bg="blue.600"
      opacity={0.07}
      filter="blur(60px)"
      pointerEvents="none"
    />

    <VStack spacing={8} textAlign="center" maxW="680px" position="relative" zIndex={1}>
      <Avatar
        name="Yu-An Chen"
        src="images/portfolio/_profile/profilepic.jpeg"
        size="2xl"
        border="3px solid"
        borderColor="teal.400"
        boxShadow="0 0 0 6px rgba(56,178,172,0.15), 0 20px 60px rgba(0,0,0,0.4)"
      />

      <VStack spacing={3}>
        <Badge
          colorScheme="teal"
          variant="subtle"
          px={4}
          py={1}
          borderRadius="full"
          fontSize="xs"
          letterSpacing="widest"
          textTransform="uppercase"
        >
          {greeting}
        </Badge>

        <Heading
          size="3xl"
          fontWeight="800"
          color="white"
          letterSpacing="tight"
          lineHeight="1.1"
        >
          {bio1}
        </Heading>

        <Text
          color="gray.400"
          fontSize={{ base: "md", md: "lg" }}
          maxW="520px"
          lineHeight="1.75"
          pt={1}
        >
          {bio2}
        </Text>
      </VStack>

      <Button
        as="a"
        href={resumeDownload}
        target="_blank"
        rel="noopener noreferrer"
        colorScheme="teal"
        size="lg"
        leftIcon={<FaDownload />}
        px={10}
        fontSize="md"
        fontWeight={600}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "0 8px 30px rgba(56,178,172,0.35)",
        }}
        transition="all 0.2s ease"
      >
        Download Resume
      </Button>
    </VStack>
  </Box>
);

export default LandingSection;
