import React from "react";
import { Avatar, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import { FaDownload } from "react-icons/fa";

// Implement the UI for the LandingSection component according to the instructions.
// Use a combination of Avatar, Heading and VStack components.
const LandingSection = ({ greeting, bio1, bio2, resumeDownload }) => (

  <FullScreenSection
    justifyContent="center"
    alignItems="center"
    isdarkbackground="true"
    backgroundColor="#2A4365"
    minHeight="50vh"
  >
    <VStack spacing={10}>
      <VStack>
        <Avatar name="Pete" src={"images/portfolio/profilepic.jpeg"} size="xl" />
        <Heading size="xs">{greeting}</Heading>
      </VStack>
      <VStack>
        <Heading size="3xl">{bio1}</Heading>
        <Text size="md">{bio2}</Text>

        <div className="columns download">
          <p>
            <Button colorScheme='blue' leftIcon={<FaDownload />}>
              <a href={resumeDownload} className="button">
                Download Resume
              </a>
            </Button>

          </p>
        </div>

      </VStack>

    </VStack>
  </FullScreenSection>
);

export default LandingSection;
