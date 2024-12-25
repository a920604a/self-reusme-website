import React, { useState } from "react";
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
    Button,
    Grid,
    GridItem,
    useBreakpointValue
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const WorksSummary = ({ works }) => {
    const [viewMode, setViewMode] = useState("grid");
    const boxBg = useColorModeValue("white", "gray.800");
    const boxHoverBg = useColorModeValue("blue.50", "gray.700");
    const textColor = useColorModeValue("gray.600", "gray.300");
    const headingColor = useColorModeValue("blue.700", "blue.300");
    const navigate = useNavigate();

    const handleBoxClick = (id) => {
        navigate(`/works/${id}`);
    };

    const gridColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 }); // 優化響應式設計

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

            {/* 顯示模式切換按鈕 */}
            <Flex justify="center" mb={6}>
                <Button
                    onClick={() => setViewMode("card")}
                    colorScheme={viewMode === "card" ? "blue" : "gray"}
                    mr={4}
                    _hover={{ bg: "blue.600", transform: "scale(1.05)" }} // 增加hover效果
                >
                    Card View
                </Button>
                <Button
                    onClick={() => setViewMode("grid")}
                    colorScheme={viewMode === "grid" ? "blue" : "gray"}
                    _hover={{ bg: "blue.600", transform: "scale(1.05)" }} // 增加hover效果
                >
                    Grid View
                </Button>
            </Flex>

            <VStack spacing={8} align="stretch">
                {viewMode === "card" ? (
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
                                    transform: "translateY(-8px) scale(1.05)", // 強調hover效果
                                }}
                                cursor="pointer"
                                onClick={() => handleBoxClick(work.id)}
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
                ) : (
                    <Grid templateColumns={`repeat(${gridColumns}, 1fr)`} gap={6}>
                        {works.map((work, index) => (
                            <GridItem key={index} w="100%">
                                <Box
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    p={6}
                                    bg={boxBg}
                                    boxShadow="xl"
                                    transition="all 0.3s"
                                    _hover={{
                                        boxShadow: "2xl",
                                        bg: boxHoverBg,
                                        transform: "translateY(-8px) scale(1.05)", // 強調hover效果
                                    }}
                                    cursor="pointer"
                                    onClick={() => handleBoxClick(work.id)}
                                >
                                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                                        <Flex alignItems="center">
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
                            </GridItem>
                        ))}
                    </Grid>
                )}
            </VStack>
        </section>
    );
};

export default WorksSummary;
