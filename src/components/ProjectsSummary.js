import React from "react";
import {
  Box,
  Heading,
  Tag,
  TagLabel,
  Stack,
  Link as ChakraLink,
  Image,
  Flex,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";




const ProjectsSummary = ({ projects }) => {
  const navigate = useNavigate(); // 使用 useNavigate 來導航

  const handleBoxClick = (index) => {
    navigate(`/projects/${index}`); // 當點擊時導航到對應的專案詳情頁
  };

  return (
    <section>
      <Heading as="h2" size="lg" mb={6} id="project-section">
        Projects
      </Heading>
      <Stack spacing={6}>
        {projects.map((project, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            boxShadow="sm"
            bg="#e0fbf5"
            color="black"
            _hover={{ boxShadow: "md", bg: "gray.100" }}
            cursor="pointer" // 改變游標樣式，提示用戶這是可點擊的
            onClick={() => handleBoxClick(index)} // 點擊時觸發導航

          >
            <Flex direction={{ base: "column", md: "row" }} spacing={6}>
              {/* 左側圖片 */}
              <Box flex="1" mb={{ base: 4, md: 0 }}>
                <Image
                  src={`images/portfolio/${project.image}`}
                  alt={project.title}
                  objectFit="cover"
                  height="200px"
                  width="100%"
                  borderRadius="md"
                />
              </Box>

              {/* 右側內容 */}
              <Box flex="2" ml={{ md: 6 }}> {/* 在中等及以上大小屏幕加入間距 */}
                <Text fontSize="sm" color="gray.400" mb={2}>
                  {project.date}
                </Text>
                <Heading as="h3" size="md" mb={4}>
                  {project.title}
                </Heading>

                <Stack direction="row" spacing={2} mb={4}>
                  {project.tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex} colorScheme="teal" size="sm">
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  ))}
                </Stack>

                <ChakraLink
                  as={Link}
                  to={`/projects/${index}`}
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  View Details
                </ChakraLink>
              </Box>
            </Flex>
          </Box>
        ))}
      </Stack>
    </section>
  );
};

export default ProjectsSummary;
