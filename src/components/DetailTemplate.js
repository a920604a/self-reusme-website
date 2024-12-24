import React, { useState } from "react";
import {
    Box,
    Heading,
    Text,
    Tag,
    TagLabel,
    Stack,
    Link as ChakraLink,
    Image,
    Divider,
    UnorderedList,
    ListItem,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";

const DetailTemplate = ({ title, subtitle, category, description, tags, image, reference, repo, index, backLink, backLabel }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // 管理模態框狀態

    return (
        <Box
            p={8}
            backgroundColor="white"
            borderRadius="lg"
            boxShadow="lg"
            maxW="800px"
            mx="auto"
            mt="60px"
            spacing={8}
        >
            {/* 標題 */}
            <Heading as="h1" id={`details-${index}`} mb={6} textAlign="center" fontSize="2xl" color="teal.600">
                {title}
            </Heading>

            {/* 標籤 */}
            {tags && tags.length > 0 && (
                <Stack direction="row" spacing={2} mb={6} justify="center">
                    {tags.map((tag, tagIndex) => (
                        <Tag
                            key={tagIndex}
                            colorScheme="teal"
                            size="md"
                            borderRadius="full"
                            _hover={{ transform: "scale(1.1)", transition: "0.2s" }}
                        >
                            <TagLabel>{tag}</TagLabel>
                        </Tag>
                    ))}
                </Stack>
            )}

            {/* 圖片 */}
            {image && (
                <>
                    <Image
                        src={`images/portfolio/${image}`}
                        alt={title}
                        objectFit="cover"
                        borderRadius="md"
                        height="300px"
                        width="100%"
                        mb={6}
                        boxShadow="sm"
                        _hover={{ transform: "scale(1.02)", transition: "0.2s", cursor: "pointer" }}
                        onClick={() => setIsModalOpen(true)} // 點擊開啟模態框
                    />

                    {/* 放大圖片的模態框 */}
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="full">
                        <ModalOverlay />
                        <ModalContent bg="blackAlpha.900"> {/* 背景色設定為黑色 */}
                            <ModalCloseButton color="white" /> {/* 按鈕改為白色 */}
                            <ModalBody p={0}> {/* 移除 padding */}
                                <Image
                                    src={`images/portfolio/${image}`}
                                    alt={title}
                                    objectFit="contain"
                                    width="100vw" /* 全螢幕寬度 */
                                    height="100vh" /* 全螢幕高度 */
                                    borderRadius="none"
                                    boxShadow="none"
                                    m="auto"
                                />
                            </ModalBody>
                        </ModalContent>
                    </Modal>

                </>
            )}


            {/* 描述 */}
            {description?.length ? (
                <UnorderedList spacing={3} color="gray.800" fontSize="md" mb={6}>
                    {description.map((item, index) => (
                        <ListItem key={index} lineHeight="1.8">
                            {item}
                        </ListItem>
                    ))}
                </UnorderedList>
            ) : (
                <Text fontSize="md" color="gray.600" textAlign="center">
                    No description available.
                </Text>
            )}

            <Divider my={6} />

            {/* 參考和倉庫鏈接 */}
            <Stack direction="column" spacing={4} mb={6}>
                {reference && (
                    <ChakraLink
                        href={reference}
                        isExternal
                        color="blue.500"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        _hover={{ textDecoration: "underline", color: "blue.700" }}
                    >
                        <Icon as={FaExternalLinkAlt} /> Reference Link
                    </ChakraLink>
                )}

                {repo && (
                    <ChakraLink
                        href={repo}
                        isExternal
                        color="blue.500"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        _hover={{ textDecoration: "underline", color: "blue.700" }}
                    >
                        <Icon as={FaExternalLinkAlt} /> View Repository
                    </ChakraLink>
                )}
            </Stack>

            <Divider my={6} />

            {/* 返回鏈接 */}
            <ChakraLink
                as={Link}
                to={backLink || "/"}
                color="teal.500"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                _hover={{ textDecoration: "underline", color: "teal.700" }}
            >
                <Icon as={FaArrowLeft} /> {`Back to ${backLabel || "List"}`}
            </ChakraLink>
        </Box>
    );
};

export default DetailTemplate;
