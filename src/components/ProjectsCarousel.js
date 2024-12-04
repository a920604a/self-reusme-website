import React from "react";
import { Box, Heading, Tag, TagLabel, Stack, Link as ChakraLink, Image, Text, useBreakpointValue, Flex } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Slick carousel 配置
const sliderSettings = {
    dots: true, // 顯示底部點
    infinite: true, // 無限循環
    speed: 800, // 切換速度 (ms)
    slidesToShow: 1, // 每次顯示一個內容
    slidesToScroll: 1, // 每次滾動一個內容
    autoplay: true, // 自動播放
    autoplaySpeed: 2000, // 每 2 秒切換
    arrows: false, // 隱藏左右箭頭
};
import { Link, useNavigate } from "react-router-dom";


const ProjectsCarousel = ({ projects }) => {
    // const navigate = useNavigate(); // 使用 useNavigate 來導航

    // const handleBoxClick = (id) => {
    //     navigate(`/projects/${id}`); // 導航到專案詳情頁，基於唯一的 id
    // };



    // 斷點控制背景和陰影
    const boxBg = useBreakpointValue({ base: "white", md: "#e0fbf5" });
    const boxShadow = useBreakpointValue({ base: "none", md: "lg" });

    return (
        <section>
            <Heading as="h2" size="lg" mb={6} id="projects-section" textAlign="center" color="blue.700">
                Projects
            </Heading>
            {/* 添加 Box 來增加底部留白 */}
            <Box mb={10}>
                <Slider {...sliderSettings}>
                    {projects.map((project, index) => (
                        <Box
                            key={index}
                            borderWidth="1px"
                            borderRadius="lg"
                            p={6}
                            bg={boxBg}
                            boxShadow={boxShadow}
                            _hover={{
                                boxShadow: "2xl",
                                transform: "translateY(-6px)",
                                transition: "all 0.3s ease",
                            }}
                            transition="all 0.3s ease"
                        // cursor="pointer" // 改變游標樣式，提示用戶這是可點擊的
                        // onClick={() => handleBoxClick(project.id)}
                        // 點擊時觸發導航
                        >
                            {/* 使用 Flex 布局讓圖片在左邊 */}
                            <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between">
                                {/* 圖片區塊 */}
                                <Box flex="1" mb={{ base: 4, md: 0 }} mr={{ md: 4 }}>
                                    <Image
                                        src={`images/portfolio/${project.image}`}
                                        alt={project.title}
                                        objectFit="cover"
                                        height="250px"
                                        width="100%"
                                        borderRadius="md"
                                        boxShadow="lg"
                                        transition="transform 0.3s ease"
                                        _hover={{ transform: "scale(1.05)" }}
                                    />
                                </Box>

                                {/* 右側內容區塊 */}
                                <Box flex="2" mt={4}>
                                    <Text fontSize="sm" color="gray.400" mb={2}>
                                        {project.date}
                                    </Text>
                                    <Heading as="h3" size="md" mb={4} color="blue.700">
                                        {project.title}
                                    </Heading>

                                    {/* 標籤區塊 */}
                                    <Stack direction="row" spacing={2} mb={4}>
                                        {project.tags.map((tag, tagIndex) => (
                                            <Tag key={tagIndex} colorScheme="teal" size="sm">
                                                <TagLabel>{tag}</TagLabel>
                                            </Tag>
                                        ))}
                                    </Stack>

                                    {/* 連結區塊 */}
                                    <ChakraLink
                                        as={Link}
                                        to={`/projects/${project.id}`}
                                        color="blue.500"
                                        fontWeight="bold"
                                        _hover={{
                                            textDecoration: "underline",
                                            color: "blue.700",
                                        }}
                                    >
                                        View Details →
                                    </ChakraLink>
                                </Box>
                            </Flex>
                        </Box>
                    ))}
                </Slider>
            </Box>
        </section>
    );
};

export default ProjectsCarousel;
