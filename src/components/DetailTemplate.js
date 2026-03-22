import React, { useState } from "react";
import {
  Box, Heading, Text, Tag, TagLabel, Stack, Link as ChakraLink, Image,
  Divider, UnorderedList, ListItem, Icon, Modal, ModalOverlay, ModalContent,
  ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanels, TabPanel,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt, FaArrowLeft, FaDesktop } from "react-icons/fa";

const imgLabel = (path) => {
  const file = path.split("/").pop().replace(/\.(png|jpe?g)$/i, "");
  return (
    { flow: "User Flow", arch: "Architecture", ui: "Interface",
      airflow: "Pipeline", streamlit: "Dashboard" }[file] ||
    file.charAt(0).toUpperCase() + file.slice(1)
  );
};

const stripMd = (text) => text.replace(/\*\*(.*?)\*\*/g, "$1");

const ImageGallery = ({ images, title, onZoom }) => {
  if (images.length === 1) {
    return (
      <Image
        src={`${process.env.PUBLIC_URL}/images/portfolio/${images[0]}`}
        alt={title}
        objectFit="contain"
        borderRadius="12px"
        maxH="360px"
        width="100%"
        bg="#0b1326"
        mb={6}
        border="1px solid #464554"
        cursor="zoom-in"
        _hover={{ opacity: 0.9, borderColor: "#c0c1ff" }}
        transition="all 0.2s"
        onClick={() => onZoom(images[0])}
      />
    );
  }

  return (
    <Tabs
      variant="soft-rounded"
      size="sm"
      mb={6}
      sx={{
        "& [role=tab]": {
          fontFamily: "var(--font-label)", fontSize: "xs", fontWeight: 700,
          color: "#908fa0", borderRadius: "full", border: "1px solid #464554",
        },
        "& [role=tab][aria-selected=true]": {
          background: "rgba(192,193,255,0.15)",
          color: "#c0c1ff",
          borderColor: "rgba(192,193,255,0.3)",
        },
        "& [role=tablist]": { bg: "transparent", gap: "4px" },
      }}
    >
      <TabList mb={3} flexWrap="wrap" gap={1}>
        {images.map((img, i) => (
          <Tab key={i}>{imgLabel(img)}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {images.map((img, i) => (
          <TabPanel key={i} p={0}>
            <Image
              src={`${process.env.PUBLIC_URL}/images/portfolio/${img}`}
              alt={`${title} — ${imgLabel(img)}`}
              objectFit="contain"
              borderRadius="12px"
              maxH="360px"
              width="100%"
              bg="#0b1326"
              border="1px solid #464554"
              cursor="zoom-in"
              _hover={{ opacity: 0.9, borderColor: "#c0c1ff" }}
              transition="all 0.2s"
              onClick={() => onZoom(img)}
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

  const gallery   = images   && images.length   > 0 ? images   : image ? [image] : [];
  const uiGallery = uiImages && uiImages.length > 0 ? uiImages : [];

  const renderRepoLinks = (repo) => {
    if (Array.isArray(repo)) {
      return repo.map((item, i) =>
        Object.entries(item).map(([key, value], idx) => (
          <ChakraLink
            key={`${i}-${idx}`} href={value} isExternal
            display="inline-flex" alignItems="center" gap={2}
            fontFamily="var(--font-headline)" fontWeight={700} fontSize="sm"
            style={{ color: "#5de6ff", textDecoration: "none" }}
            _hover={{ color: "#c0c1ff", textDecoration: "none" }}
          >
            <Icon as={FaExternalLinkAlt} boxSize={3} /> {key}
          </ChakraLink>
        ))
      );
    }
    if (typeof repo === "string") {
      return (
        <ChakraLink
          href={repo} isExternal
          display="inline-flex" alignItems="center" gap={2}
          fontFamily="var(--font-headline)" fontWeight={700} fontSize="sm"
          style={{ color: "#5de6ff", textDecoration: "none" }}
          _hover={{ color: "#c0c1ff", textDecoration: "none" }}
        >
          <Icon as={FaExternalLinkAlt} boxSize={3} /> View Repository
        </ChakraLink>
      );
    }
    return null;
  };

  return (
    <Box bg="#0b1326" minH="100vh" pt="90px" pb={16} px={{ base: 4, md: 8 }}>
      <Box maxW="860px" mx="auto">

        {/* Back link */}
        <ChakraLink
          as={Link} to={backLink || "/"}
          display="inline-flex" alignItems="center" gap={2} mb={8}
          fontFamily="var(--font-headline)" fontWeight={700} fontSize="sm"
          style={{ color: "#5de6ff", textDecoration: "none" }}
          _hover={{ color: "#c0c1ff", textDecoration: "none" }}
        >
          <Icon as={FaArrowLeft} boxSize={3} /> Back to {backLabel || "List"}
        </ChakraLink>

        {/* Main card */}
        <Box bg="#131b2e" borderRadius="20px" border="1px solid #464554" p={{ base: 6, md: 8 }}>

          {category && (
            <Text
              fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
              textTransform="uppercase" mb={3} style={{ color: "#5de6ff" }}
            >
              {category}
            </Text>
          )}

          <Heading
            as="h1" id={`details-${index}`}
            fontFamily="var(--font-headline)" fontWeight="800"
            fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
            mb={5} style={{ color: "#c0c1ff" }}
          >
            {title}
          </Heading>

          {tags && tags.length > 0 && (
            <Stack direction="row" spacing={2} mb={6} flexWrap="wrap">
              {tags.map((tag, i) => (
                <Tag
                  key={i} size="sm" borderRadius="full" px={3}
                  bg="#222a3d" color="#c7c4d7" border="1px solid #464554"
                  fontSize="xs" fontFamily="var(--font-label)"
                >
                  <TagLabel>{tag}</TagLabel>
                </Tag>
              ))}
            </Stack>
          )}

          {gallery.length > 0 && (
            <ImageGallery images={gallery} title={title} onZoom={openZoom} />
          )}

          {description ? (
            Array.isArray(description) ? (
              <UnorderedList
                spacing={3} fontSize="sm" mb={6}
                sx={{ "& li": { color: "#c7c4d7", lineHeight: "1.8", fontFamily: "var(--font-body)" } }}
              >
                {description.map((item, i) => (
                  <ListItem key={i}>{stripMd(item)}</ListItem>
                ))}
              </UnorderedList>
            ) : (
              Object.entries(description).map(([key, value], i) => (
                <Box key={i} mb={6}>
                  <Text
                    as="h2" fontSize="xs" fontFamily="var(--font-label)" fontWeight={700}
                    letterSpacing="widest" textTransform="uppercase" mt={6} mb={3}
                    style={{ color: "#5de6ff" }}
                  >
                    {key.replace(/_/g, " ")}
                  </Text>
                  <UnorderedList
                    spacing={2}
                    sx={{ "& li": { color: "#c7c4d7", lineHeight: "1.8", fontSize: "sm", fontFamily: "var(--font-body)" } }}
                  >
                    {Array.isArray(value)
                      ? value.map((item, idx) => (
                          <ListItem key={idx}>{stripMd(String(item))}</ListItem>
                        ))
                      : String(value).split("。").map((item, idx) =>
                          item.trim() && <ListItem key={idx}>{item.trim()}</ListItem>
                        )
                    }
                  </UnorderedList>
                </Box>
              ))
            )
          ) : (
            <Text fontSize="sm" textAlign="center" style={{ color: "#908fa0" }}>
              No description available.
            </Text>
          )}

          {uiGallery.length > 0 && (
            <>
              <Divider my={6} borderColor="#464554" />
              <Stack direction="row" align="center" spacing={2} mb={4}>
                <Icon as={FaDesktop} style={{ color: "#c0c1ff" }} />
                <Text
                  fontSize="xs" fontFamily="var(--font-label)" fontWeight={700}
                  letterSpacing="widest" textTransform="uppercase" style={{ color: "#c0c1ff" }}
                >
                  User Interface
                </Text>
              </Stack>
              <Box bg="#171f33" borderRadius="12px" p={4} border="1px solid #464554">
                <ImageGallery images={uiGallery} title={title} onZoom={openZoom} />
              </Box>
            </>
          )}

          {(reference || repo) && (
            <>
              <Divider my={6} borderColor="#464554" />
              <Stack direction="column" spacing={3}>
                {reference && (
                  <ChakraLink
                    href={reference} isExternal
                    display="inline-flex" alignItems="center" gap={2}
                    fontFamily="var(--font-headline)" fontWeight={700} fontSize="sm"
                    style={{ color: "#5de6ff", textDecoration: "none" }}
                    _hover={{ color: "#c0c1ff", textDecoration: "none" }}
                  >
                    <Icon as={FaExternalLinkAlt} boxSize={3} /> Reference Link
                  </ChakraLink>
                )}
                {renderRepoLinks(repo)}
              </Stack>
            </>
          )}
        </Box>
      </Box>

      {/* Lightbox */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="full">
        <ModalOverlay bg="rgba(6,14,32,0.95)" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" zIndex={1} size="lg" />
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
