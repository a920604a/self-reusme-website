import React from "react";
import {
    Box,
    Heading,
    Text,
    VStack,
    Flex,
    Link as ChakraLink,
    Badge,
    useColorModeValue,
    Stack,
    Avatar,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const WorksSummary = ({ works }) => {
    const boxBg = useColorModeValue("white", "gray.800");
    const boxHoverBg = useColorModeValue("blue.50", "gray.700");
    const textColor = useColorModeValue("gray.600", "gray.300");
    const headingColor = useColorModeValue("blue.700", "blue.300");
    const navigate = useNavigate(); // 使用 useNavigate 來導航

    const handleBoxClick = (id) => {
        navigate(`/works/${id}`); // 導航到專案詳情頁，基於唯一的 id
    };
    return (
        <section>
            <Heading
                as="h2"
                size="lg"
                mb={8}
                id="work-experience-section"
                textAlign="center"
                color={headingColor}
                fontWeight="bold"
            >
                Work Experience
            </Heading>
            <VStack spacing={8} align="stretch">
                {works.map((work, index) => (
                    <Box
                        key={index}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={8}
                        bg={boxBg}
                        boxShadow="xl"
                        transition="all 0.3s"
                        _hover={{
                            boxShadow: "2xl",
                            bg: boxHoverBg,
                            transform: "translateY(-8px)",
                        }}
                        cursor="pointer" // 改變游標樣式，提示用戶這是可點擊的
                        onClick={() => handleBoxClick(work.id)} // 點擊時觸發導航

                        w="100%"
                        mt={6}
                    >
                        <Flex justifyContent="space-between" alignItems="center" mb={4}>
                            <Flex alignItems="center">
                                {/* 公司名稱和公司Logo */}
                                <Avatar size="sm" name={work.company} src={work.logo} mr={4} />
                                <Heading size="md" color={headingColor} fontWeight="semibold">
                                    {work.company}
                                </Heading>
                            </Flex>
                            <Badge colorScheme="green" fontSize="0.9em" fontWeight="bold">
                                {work.years}
                            </Badge>
                        </Flex>
                        <Text fontSize="lg" fontStyle="italic" color={textColor} mb={4}>
                            {work.position}
                        </Text>
                        <Text fontSize="sm" color={textColor} mb={4}>
                            {work.description}
                        </Text>
                        <Stack direction="row" spacing={4}>
                            <ChakraLink
                                as={Link}
                                to={`/works/${index}`}
                                color="blue.500"
                                fontWeight="bold"
                                _hover={{ textDecoration: "underline", color: "blue.700" }}
                            >
                                View Details →
                            </ChakraLink>
                        </Stack>
                    </Box>
                ))}
            </VStack>
        </section>
    );
};

export default WorksSummary;
