import React from "react";
import { Avatar, Heading, VStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";

const greeting = "Hello, I am Yu-An, Chen!";
const bio1 = "A software Engineer";
const bio2 = "specialised in Data/System Integration";

// Implement the UI for the LandingSection component according to the instructions.
// Use a combination of Avatar, Heading and VStack components.
const LandingSection = () => (

  <FullScreenSection
    justifyContent="center"
    alignItems="center"
    isDarkBackground
    backgroundColor="#2A4365"
    minHeight="50vh"
  >
    <VStack spacing={10}>
      <VStack>
        <Avatar name="Pete" src={require("../images/profilepic.jpeg")} size="xl" />
        <Heading size="xs">{greeting}</Heading>
      </VStack>
      <VStack>
        <Heading size="3xl">{bio1}</Heading>
        {/* <Heading size="3xl">{bio2}</Heading> */}

      </VStack>

    </VStack>
  </FullScreenSection>
);

export default LandingSection;
