import { Heading, Link, Image, Text, VStack } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import React from "react";

const Card = ({ title, description, imageSrc , url}) => {
  // Implement the UI for the Card component according to the instructions.
  // You should be able to implement the component with the elements imported above.
  // Feel free to import other UI components from Chakra UI if you wish to.


  const cardProperty = {
    backgroundColor: "white",
    borderRadius: "10px",
    color: "black",
  }

  return (
    <VStack style={cardProperty}>
      <VStack style={{
        padding: '10px',
      }} alignItems="flex-start">

        <Heading size="md">{title}</Heading>

        <Text style={{ color: "gray" }} >{description}</Text>
        <Heading size="xs">
          <Link color='teal.500' href={url}>
          See More  <FontAwesomeIcon icon={faArrowRight} size="1x" />
          </Link>
        </Heading>
      </VStack>
      {/* <Image
        objectFit='cover'
        src={imageSrc}
        alt={title}
        borderRadius="10px"
      />       */}
    </VStack >

  );
};

export default Card;
