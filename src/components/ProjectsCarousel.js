import React from "react";
import { Box, Heading, Tag, TagLabel, Stack, Link as ChakraLink, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProjectsCarousel = ({ projects }) => {
    // slick-carousel 設定
    const settings = {
        dots: true, // 顯示底部點
        infinite: true, // 無限循環
        speed: 800, // 切換速度 (ms)
        slidesToShow: 1, // 每次顯示一個內容
        slidesToScroll: 1, // 每次滾動一個內容
        autoplay: true, // 自動播放
        autoplaySpeed: 2000, // 每 2 秒切換
    };

    return (
        <section>
            <Heading as="h2" size="lg" mb={6} id="project-section">
                Projects
            </Heading>
            <Slider {...settings}>
                {projects.map((project, index) => (
                    <Box
                        key={index}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={6}
                        boxShadow="sm"
                        bg="#e0fbf5"
                        color="black"
                        cursor="pointer" // 改變游標樣式
                    >
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
                        <Box flex="2" mt={4}>
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
                                View Details →
                            </ChakraLink>
                        </Box>
                    </Box>
                ))}
            </Slider>
        </section>
    );
};

export default ProjectsCarousel;
