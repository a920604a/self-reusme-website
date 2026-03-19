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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";

/** Derive a human-readable tab label from an image filename. */
const imgLabel = (path) => {
  const file = path.split("/").pop().replace(/\.(png|jpe?g)$/i, "");
  return (
    { flow: "User Flow", arch: "Architecture", ui: "Interface",
      airflow: "Pipeline", streamlit: "Dashboard" }[file] ||
    file.charAt(0).toUpperCase() + file.slice(1)
  );
};

const stripMd = (text) => text.replace(/\*\*(.*?)\*\*/g, "$1");

const DetailTemplate = ({ title, subtitle, category, description, tags, images, image, reference, repo, index, backLink, backLabel }) => {
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [modalImg,    setModalImg]       = useState(null);

  // Normalise: prefer new `images[]`, fall back to legacy `image` string
  const gallery = images && images.length > 0 ? images : image ? [image] : [];

  const renderRepoLinks = (repo) => {
    if (Array.isArray(repo)) {
      return repo.map((item, i) =>
        Object.entries(item).map(([key, value], idx) => (
          <ChakraLink
            key={`${i}-${idx}`}
            href={value}
            isExternal
            color="blue.500"
            fontWeight="bold"
            display="flex"
            alignItems="center"
            gap={2}
            _hover={{ textDecoration: "underline", color: "blue.700" }}
          >
            <Icon as={FaExternalLinkAlt} /> {key}
          </ChakraLink>
        ))
      );
    } else if (typeof repo === "string") {
      return (
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
      );
    }
    return null;
  };

  return (
    <Box bg="#f8fafc" minH="100vh" pt="80px" pb={16} px={{ base: 4, md: 8 }}>
      <Box maxW="800px" mx="auto">
        {/* Back link at the TOP */}
        <ChakraLink
          as={Link}
          to={backLink || "/"}
          color="teal.600"
          fontWeight="bold"
          display="inline-flex"
          alignItems="center"
          gap={2}
          mb={6}
          _hover={{ textDecoration: "none", color: "teal.800" }}
        >
          <Icon as={FaArrowLeft} /> Back to {backLabel || "List"}
        </ChakraLink>

        <Box
          p={8}
          backgroundColor="white"
          borderRadius="16px"
          boxShadow="0 4px 24px rgba(0,0,0,0.08)"
          border="1px solid"
          borderColor="gray.100"
        >
          {/* Title */}
          <Heading as="h1" id={`details-${index}`} mb={4} fontSize="2xl" color="teal.600">
            {title}
          </Heading>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <Stack direction="row" spacing={2} mb={6} flexWrap="wrap">
              {tags.map((tag, tagIndex) => (
                <Tag key={tagIndex} colorScheme="teal" size="md" borderRadius="full">
                  <TagLabel>{tag}</TagLabel>
                </Tag>
              ))}
            </Stack>
          )}

          {/* Image Gallery */}
          {gallery.length > 0 && (
            <>
              {gallery.length === 1 ? (
                <Image
                  src={`images/portfolio/${gallery[0]}`}
                  alt={title}
                  objectFit="contain"
                  borderRadius="md"
                  maxH="340px"
                  width="100%"
                  bg="gray.900"
                  mb={6}
                  boxShadow="sm"
                  cursor="zoom-in"
                  _hover={{ opacity: 0.92 }}
                  onClick={() => { setModalImg(gallery[0]); setIsModalOpen(true); }}
                />
              ) : (
                <Tabs variant="soft-rounded" colorScheme="teal" size="sm" mb={6}>
                  <TabList mb={3} flexWrap="wrap" gap={1}>
                    {gallery.map((img, i) => (
                      <Tab key={i} fontSize="xs" fontWeight="bold">{imgLabel(img)}</Tab>
                    ))}
                  </TabList>
                  <TabPanels>
                    {gallery.map((img, i) => (
                      <TabPanel key={i} p={0}>
                        <Image
                          src={`images/portfolio/${img}`}
                          alt={`${title} — ${imgLabel(img)}`}
                          objectFit="contain"
                          borderRadius="md"
                          maxH="340px"
                          width="100%"
                          bg="gray.900"
                          boxShadow="sm"
                          cursor="zoom-in"
                          _hover={{ opacity: 0.92 }}
                          onClick={() => { setModalImg(img); setIsModalOpen(true); }}
                        />
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              )}

              {/* Full-screen lightbox */}
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="full">
                <ModalOverlay />
                <ModalContent bg="blackAlpha.900">
                  <ModalCloseButton color="white" zIndex={1} />
                  <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
                    <Image
                      src={`images/portfolio/${modalImg}`}
                      alt={title}
                      objectFit="contain"
                      maxW="100vw"
                      maxH="100vh"
                    />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
          )}

          {/* Description */}
          {description ? (
            Array.isArray(description) ? (
              <UnorderedList spacing={3} color="gray.800" fontSize="md" mb={6}>
                {description.map((item, i) => (
                  <ListItem key={i} lineHeight="1.8">{stripMd(item)}</ListItem>
                ))}
              </UnorderedList>
            ) : (
              Object.entries(description).map(([key, value], i) => (
                <div key={i}>
                  <Text as="h2" fontSize="xl" fontWeight="bold" mt={6} mb={3} color="blue.500">
                    {key.replace(/_/g, " ").toUpperCase()}
                  </Text>
                  <UnorderedList spacing={3} color="gray.800" fontSize="md" mb={6}>
                    {Array.isArray(value)
                      ? value.map((item, idx) => (
                          <ListItem key={idx} lineHeight="1.8">{stripMd(String(item))}</ListItem>
                        ))
                      : String(value).split("。").map((item, idx) =>
                          item.trim() && (
                            <ListItem key={idx} lineHeight="1.8">{item.trim()}</ListItem>
                          )
                        )
                    }
                  </UnorderedList>
                </div>
              ))
            )
          ) : (
            <Text fontSize="md" color="gray.600" textAlign="center">
              No description available.
            </Text>
          )}

          {(reference || repo) && (
            <>
              <Divider my={6} />
              <Stack direction="column" spacing={4} mb={2}>
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
                {renderRepoLinks(repo)}
              </Stack>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DetailTemplate;
