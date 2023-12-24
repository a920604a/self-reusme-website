import React from "react";
import { Avatar, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import { FaDownload } from "react-icons/fa";

const greeting = "Hello, I am Yu-An, Chen!";
const bio1 = "A software Engineer";
const bio2 = "有著多年的系統整合經驗，整合機器學習演算法與開發過後端，已經幫助許多專案的達成。";
const resumeDownload = "https://www.cakeresume.com/s--u3LSKmee4rN_6b6EolDWyQ--/a920604a";
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
