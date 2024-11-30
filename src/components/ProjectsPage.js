import React, { useState } from "react";
import { Stack, Select, Text, Heading, Radio, RadioGroup, Box, Flex } from "@chakra-ui/react";
import ProjectsSummary from "./ProjectsSummary";

const ProjectsPage = ({ projects }) => {

    const [tagsFilter, setTagsFilter] = useState(""); // 篩選標籤
    const [categoryFilter, setCategoryFilter] = useState(""); // 篩選類別
    const [sort, setSort] = useState(""); // 排序條件

    const categories = [
        ...new Set(projects.map((project) => project.category)),
    ];

    const allTags = [
        ...new Set(projects.flatMap((project) => project.tags)),
    ];

    // 过滤项目
    const filteredProjects = projects.filter((project) => {
        const matchesCategory = categoryFilter
            ? project.category.toLowerCase().includes(categoryFilter.toLowerCase())
            : true;

        const matchesTags = tagsFilter
            ? project.tags.some((tag) =>
                tag.toLowerCase().includes(tagsFilter.toLowerCase())
            )
            : true;

        return matchesCategory && matchesTags;
    });

    // 排序项目
    const sortedProjects = filteredProjects.sort((a, b) => {
        if (sort === "date ASC") {
            const dateA = new Date(a.date.split("-")[0].trim());
            const dateB = new Date(b.date.split("-")[0].trim());
            return dateA - dateB; // 升序排列
        }
        if (sort === "date DEC") {
            const dateA = new Date(a.date.split("-")[0].trim());
            const dateB = new Date(b.date.split("-")[0].trim());
            return dateB - dateA; // 降序排列（最近的日期排在前面）
        }
        if (sort === "title") {
            return a.title.localeCompare(b.title); // 根据标题排序
        }
        return 0; // 默认排序
    });

    return (
        <div>
            <Heading as="h1" size="xl" mb={6} textAlign="center">
                All Projects
            </Heading>

            {/* 筛选和排序 */}
            <Flex direction={{ base: "column", md: "row" }} spacing={10} mb={6} wrap="no-wrap" justify="center">
                {/* 标签筛选器 */}
                <Box
                    width={{ base: "100%", md: "auto" }}
                    mb={{ base: 4, md: 0 }}
                    p={2}
                    mr={{ md: 6 }} // 在水平方向上增加右边距
                >
                    <Flex align="center" mb={2}>
                        <Text fontWeight="bold" mr={2}>Tag</Text>
                        <Select
                            value={tagsFilter || ""} // 默认选择 "All Tags"
                            onChange={(e) => setTagsFilter(e.target.value)}
                            bg="gray.50"
                            borderColor="gray.300"
                            _focus={{ borderColor: "blue.500" }}
                            boxShadow="sm"
                            size="lg"
                            p={3}
                            rounded="md"
                            transition="all 0.3s ease"
                        >
                            <option value="">All Tags</option> {/* 这是 "All Tags" 选项 */}
                            {allTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </Select>
                    </Flex>

                </Box>

                {/* 排序筛选器 */}
                <Box
                    width={{ base: "100%", md: "auto" }}
                    mb={{ base: 4, md: 0 }}
                    p={2}
                    mr={{ md: 6 }} // 在水平方向上增加右边距
                >
                    <Flex align="center" mb={2}>
                        <Text fontWeight="bold" mr={2}>Sort</Text>
                        <Select
                            value={sort || "date ASC"} // 默认选择第一个排序选项
                            onChange={(e) => setSort(e.target.value)}
                            bg="gray.50"
                            borderColor="gray.300"
                            _focus={{ borderColor: "blue.500" }}
                            boxShadow="sm"
                            size="lg"
                            p={3}
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
            <Box width={{ base: "100%", md: "auto" }} mb={{ base: 4, md: 0 }} p={2} textAlign="center">
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
        </div>
    );
};

export default ProjectsPage;
