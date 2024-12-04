import React from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";

const Footer = ({ data, fileName = "default.json" }) => {
  const handleDownloadJsonFile = () => {
    if (!data) {
      console.error("No data to download");
      return;
    }

    const file = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const element = document.createElement("a");
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      window.open(URL.createObjectURL(file));
    } else {
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <Box backgroundColor="#18181b" py={4}>
      <footer>
        <Flex
          margin="0 auto"
          px={12}
          color="white"
          justifyContent="space-between" // 元素左右分佈
          alignItems="center"
          maxWidth="1024px"
          height={16}
        >
          {/* 文字部分 */}
          <Text fontSize="sm" color="gray.400">
            Yu-AN, CHEN • © 2024
          </Text>

          {/* 按鈕部分 */}
          <Button
            onClick={handleDownloadJsonFile}
            colorScheme="teal"
            size="sm"
            variant="outline"
          >
            Download JSON
          </Button>
        </Flex>
      </footer>
    </Box>
  );
};

export default Footer;
