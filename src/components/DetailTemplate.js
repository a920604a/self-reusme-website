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
import { FaExternalLinkAlt, FaArrowLeft, FaDesktop } from "react-icons/fa";

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

/** Reusable image gallery: tabs for multiple images, single image otherwise. */
const ImageGallery = ({ images, title, onZoom, darkBg = true }) => {
  const bg = darkBg ? "gray.900" : "gray.50";
  const border = darkBg ? {} : { border: "1px solid", borderColor: "gray.200" };

  if (images.length === 1) {
    return (
      <Image
        src={`${process.env.PUBLIC_URL}/images/portfolio/${images[0]}`}
        alt={title}
        objectFit="contain"
        borderRadius="md"
        maxH="340px"
        width="100%"
        bg={bg}
        mb={6}
        boxShadow="sm"
        cursor="zoom-in"
        _hover={{ opacity: 0.92 }}
        onClick={() => onZoom(images[0])}
        {...border}
      />
    );
  }

  return (
    <Tabs variant="soft-rounded" colorScheme={darkBg ? "teal" : "blue"} size="sm" mb={6}>
      <TabList mb={3} flexWrap="wrap" gap={1}>
        {images.map((img, i) => (
          <Tab key={i} fontSize="xs" fontWeight="bold">{imgLabel(img)}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {images.map((img, i) => (
          <TabPanel key={i} p={0}>
            <Image
              src={`${process.env.PUBLIC_URL}/images/portfolio/${img}`}
              alt={`${title} — ${imgLabel(img)}`}
              objectFit="contain"
              borderRadius="md"
              maxH="340px"
              width="100%"
              bg={bg}
              boxShadow="sm"
              cursor="zoom-in"
              _hover={{ opacity: 0.92 }}
              onClick={() => onZoom(img)}
              {...border}
            />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

const DetailTemplate = ({
  title, subtitle, category, description, tags,
  images, image, uiImages,
  reference, repo, index, backLink, backLabel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImg,    setModalImg]    = useState(null);

  const openZoom = (img) => { setModalImg(img); setIsModalOpen(true); };

  // Normalise: prefer new `images[]`, fall back to legacy `image` string
  const gallery   = images   && images.length   > 0 ? images   : image ? [image] : [];
  const uiGallery = uiImages && uiImages.length > 0 ? uiImages : [];

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

          {/* ── Technical Diagrams (arch / flow / pipeline) ── */}
          {gallery.length > 0 && (
            <ImageGallery images={gallery} title={title} onZoom={openZoom} darkBg={true} />
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

          {/* ── UI Screenshots section (only when uiImages provided) ── */}
          {uiGallery.length > 0 && (
            <>
              <Divider my={6} />
              <Stack direction="row" align="center" spacing={2} mb={4}>
                <Icon as={FaDesktop} color="purple.500" />
                <Heading as="h2" fontSize="lg" fontWeight="bold" color="purple.600">
                  User Interface
                </Heading>
              </Stack>
              <Box
                bg="purple.50"
                borderRadius="12px"
                p={4}
                border="1px solid"
                borderColor="purple.100"
              >
                <ImageGallery images={uiGallery} title={title} onZoom={openZoom} darkBg={false} />
              </Box>
            </>
          )}

          {/* Reference / Repo links */}
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

      {/* ── Shared full-screen lightbox (handles both gallery & uiGallery) ── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="full">
        <ModalOverlay />
        <ModalContent bg="blackAlpha.900">
          <ModalCloseButton color="white" zIndex={1} />
          <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
            {modalImg && (
              <Image
                src={`${process.env.PUBLIC_URL}/images/portfolio/${modalImg}`}
                alt={title}
                objectFit="contain"
                maxW="100vw"
                maxH="100vh"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DetailTemplate;
