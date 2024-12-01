import React, { useState } from "react";
import { Stack, Select, Text, Heading, Radio, RadioGroup, Box, Flex, Button, useDisclosure } from "@chakra-ui/react";
import ProjectsSummary from "./ProjectsSummary";

const ProjectsPage = ({ projects }) => {
    const [tagsFilter, setTagsFilter] = useState(""); // 篩選標籤
    const [categoryFilter, setCategoryFilter] = useState(""); // 篩選類別
    const [sort, setSort] = useState(""); // 排序條件

    const categories = [...new Set(projects.map((project) => project.category))];
    const allTags = [...new Set(projects.flatMap((project) => project.tags))];

    // 过滤项目
    const filteredProjects = projects.filter((project) => {
        const matchesCategory = categoryFilter
            ? project.category.toLowerCase().includes(categoryFilter.toLowerCase())
            : true;

        const matchesTags = tagsFilter
            ? project.tags.some((tag) => tag.toLowerCase().includes(tagsFilter.toLowerCase()))
            : true;

        return matchesCategory && matchesTags;
    });

    // 排序项目
    const sortedProjects = filteredProjects.sort((a, b) => {
        const parseDate = (dateStr) => {
            if (dateStr.includes("Now")) {
                const [startDate] = dateStr.split("-");
                return new Date(startDate.trim());
            }
            return new Date(dateStr.split("-")[0].trim());
        };

        if (sort === "date ASC") {
            return parseDate(a.date) - parseDate(b.date); // 升序排列
        }
        if (sort === "date DEC") {
            return parseDate(b.date) - parseDate(a.date); // 降序排列
        }
        if (sort === "title") {
            return a.title.localeCompare(b.title); // 按標題排序
        }
        return 0; // 預設不排序
    });

    return (
        <div>
            <Heading as="h1" size="xl" mb={8} textAlign="center" color="teal.600" fontFamily="Poppins, sans-serif">
                All Projects
            </Heading>

            {/* 筛选和排序 */}
            <Flex direction={{ base: "column", md: "row" }} spacing={8} mb={6} wrap="wrap" justify="center">
                {/* 标签筛选器 */}
                <Box
                    width={{ base: "100%", md: "auto" }}
                    mb={{ base: 4, md: 0 }}
                    p={4}
                    boxShadow="lg"
                    rounded="lg"
                    transition="all 0.3s ease"
                    _hover={{ boxShadow: "2xl", transform: "scale(1.05)" }}
                >
                    <Flex align="center" mb={2}>
                        <Text fontWeight="bold" color="gray.700" mr={2}>Tag</Text>
                        <Select
                            value={tagsFilter || ""}
                            onChange={(e) => setTagsFilter(e.target.value)}
                            bg="gray.50"
                            borderColor="gray.300"
                            _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 2px rgba(0, 128, 128, 0.3)" }}
                            size="lg"
                            p={4}
                            rounded="md"
                            transition="all 0.3s ease"
                        >
                            <option value="">All Tags</option>
                            {allTags.map((tag) => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </Select>
                    </Flex>
                </Box>

                {/* 排序筛选器 */}
                <Box
                    width={{ base: "100%", md: "auto" }}
                    mb={{ base: 4, md: 0 }}
                    p={4}
                    boxShadow="lg"
                    rounded="lg"
                    transition="all 0.3s ease"
                    _hover={{ boxShadow: "2xl", transform: "scale(1.05)" }}
                >
                    <Flex align="center" mb={2}>
                        <Text fontWeight="bold" color="gray.700" mr={2}>Sort</Text>
                        <Select
                            value={sort || "date ASC"}
                            onChange={(e) => setSort(e.target.value)}
                            bg="gray.50"
                            borderColor="gray.300"
                            _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 2px rgba(0, 128, 128, 0.3)" }}
                            size="lg"
                            p={4}
                            rounded="md"
                            transition="all 0.3s ease"
                        >
                            <option value="date ASC">Date ASC</option>
                            <option value="date DEC">Date DEC</option>
                            <option value="title">Title</option>
                        </Select>
                    </Flex>
                </Box>
            </Flex>

            {/* 类别筛选器 */}
            <Box width={{ base: "100%", md: "auto" }} mb={4} p={4} boxShadow="lg" rounded="lg" textAlign="center">
                <RadioGroup onChange={setCategoryFilter} value={categoryFilter}>
                    <Stack direction={{ base: "column", md: "row" }} spacing={6} align="center">
                        <Radio value="">All Categories</Radio>
                        {categories.map((category) => (
                            <Radio key={category} value={category}>
                                {category}
                            </Radio>
                        ))}
                    </Stack>
                </RadioGroup>
            </Box>

            {/* 过滤后的项目数量 */}
            <Text textAlign="center" fontSize="lg" color="gray.600" mb={6}>
                {filteredProjects.length} Projects Found
            </Text>

            {/* 渲染项目 */}
            {sortedProjects.length === 0 ? (
                <Text textAlign="center" fontSize="lg" color="gray.500">
                    No projects found.
                </Text>
            ) : (
                <ProjectsSummary projects={sortedProjects} />
            )}

            {/* 按钮，增加页面互动 */}
            <Box textAlign="center" mt={8}>
                <Button
                    colorScheme="teal"
                    size="lg"
                    onClick={() => window.scrollTo(0, 0)}
                    boxShadow="xl"
                    _hover={{ boxShadow: "2xl", transform: "scale(1.05)" }}
                    transition="all 0.3s ease"
                >
                    Back to Top
                </Button>
            </Box>
        </div>
    );
};

export default ProjectsPage;
