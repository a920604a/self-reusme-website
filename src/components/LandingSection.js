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
    bg="#0b1326"
    pt="70px"
    px={4}
    position="relative"
    overflow="hidden"
  >
    {/* Gradient blobs */}
    <Box position="absolute" top="-80px" right="-60px" w="500px" h="500px"
      borderRadius="full" bg="#c0c1ff" opacity={0.04} filter="blur(100px)" pointerEvents="none" />
    <Box position="absolute" bottom="-60px" left="-60px" w="400px" h="400px"
      borderRadius="full" bg="#5de6ff" opacity={0.04} filter="blur(80px)" pointerEvents="none" />
    <Box position="absolute" top="30%" left="20%" w="300px" h="300px"
      borderRadius="full" bg="#8083ff" opacity={0.03} filter="blur(120px)" pointerEvents="none" />

    <VStack spacing={8} textAlign="center" maxW="680px" position="relative" zIndex={1}>
      {/* Avatar */}
      <Box
        borderRadius="full"
        p="3px"
        className="editorial-gradient"
        display="inline-block"
      >
        <Avatar
          name="Yu-An Chen"
          src={`${process.env.PUBLIC_URL}/images/portfolio/_profile/profilepic.jpeg`}
          size="2xl"
          border="3px solid #0b1326"
          boxShadow="0 0 40px rgba(192,193,255,0.15)"
        />
      </Box>

      <VStack spacing={3}>
        {/* Role badge */}
        <Badge
          px={4} py={1}
          borderRadius="full"
          fontSize="xs"
          fontFamily="var(--font-label)"
          letterSpacing="widest"
          textTransform="uppercase"
          style={{
            background: "rgba(192,193,255,0.1)",
            color: "#c0c1ff",
            border: "1px solid rgba(192,193,255,0.2)",
          }}
        >
          {bio1}
        </Badge>

        {/* Name / Greeting */}
        <Heading
          as="h1"
          fontFamily="var(--font-headline)"
          fontWeight="800"
          fontSize={{ base: "3xl", md: "5xl" }}
          lineHeight="1.1"
          letterSpacing="-0.02em"
          style={{ color: "#dae2fd" }}
        >
          {greeting}
        </Heading>

        {/* Bio */}
        <Text
          fontFamily="var(--font-body)"
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.8"
          maxW="520px"
          pt={1}
          style={{ color: "#c7c4d7" }}
        >
          {bio2}
        </Text>
      </VStack>

      {/* CTA Button */}
      <Button
        as="a"
        href={resumeDownload}
        target="_blank"
        rel="noopener noreferrer"
        leftIcon={<FaDownload />}
        size="lg"
        px={10}
        fontFamily="var(--font-headline)"
        fontWeight={700}
        fontSize="sm"
        letterSpacing="wide"
        className="editorial-gradient"
        style={{ color: "#1000a9" }}
        border="none"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "0 8px 30px rgba(192,193,255,0.25)",
          opacity: 0.92,
        }}
        transition="all 0.2s ease"
      >
        Download Resume
      </Button>
    </VStack>
  </Box>
);

export default LandingSection;
