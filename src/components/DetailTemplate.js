import React, { useState } from "react";
import {
  Box, Heading, Text, Tag, TagLabel, Stack, Link as ChakraLink, Image,
  Divider, UnorderedList, ListItem, Icon, Modal, ModalOverlay, ModalContent,
  ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanels, TabPanel,
  useColorModeValue,
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
  const bgImg      = useColorModeValue("#F2F2F7", "#1C1C1E");
  const borderColor = useColorModeValue("#C6C6C8", "#38383A");
  const accent      = useColorModeValue("#007AFF", "#0A84FF");
  const accentSoft  = useColorModeValue("rgba(0,122,255,0.12)", "rgba(10,132,255,0.2)");
  const labelSecond = useColorModeValue("rgba(60,60,67,0.6)", "rgba(235,235,245,0.6)");
  if (images.length === 1) {
    return (
      <Image
        src={`${process.env.PUBLIC_URL}/images/portfolio/${images[0]}`}
        alt={title}
        objectFit="contain"
        borderRadius="12px"
        maxH="360px"
        width="100%"
        bg={bgImg}
        mb={6}
        border="1px solid"
        borderColor={borderColor}
        cursor="zoom-in"
        _hover={{ opacity: 0.9, borderColor: accent }}
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
          color: labelSecond, borderRadius: "full", border: "1px solid", borderColor: borderColor,
        },
        "& [role=tab][aria-selected=true]": {
          background: accentSoft,
          color: accent,
          borderColor: accent,
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
              bg={bgImg}
              border="1px solid"
              borderColor={borderColor}
              cursor="zoom-in"
              _hover={{ opacity: 0.9, borderColor: accent }}
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

  const bgCanvas    = useColorModeValue("#FFFFFF", "#000000");
  const bgElevated  = useColorModeValue("#FFFFFF", "#2C2C2E");
  const bgGrouped   = useColorModeValue("#F2F2F7", "#1C1C1E");
  const labelPrimary  = useColorModeValue("#000000", "#FFFFFF");
  const labelSecond   = useColorModeValue("rgba(60,60,67,0.6)", "rgba(235,235,245,0.6)");
  const accent        = useColorModeValue("#007AFF", "#0A84FF");
  const accentSoft    = useColorModeValue("rgba(0,122,255,0.12)", "rgba(10,132,255,0.2)");
  const borderColor   = useColorModeValue("#C6C6C8", "#38383A");
  const separatorColor = useColorModeValue("rgba(60,60,67,0.29)", "rgba(84,84,88,0.65)");
  const bgFill        = useColorModeValue("rgba(120,120,128,0.2)", "rgba(120,120,128,0.36)");

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
            style={{ color: accent, textDecoration: "none" }}
            _hover={{ color: labelPrimary, textDecoration: "none" }}
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
    <Box bg={bgCanvas} minH="100vh" pt="90px" pb={16} px={{ base: 4, md: 8 }}>
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
        <Box bg={bgElevated} borderRadius="20px" border="1px solid" borderColor={borderColor} p={{ base: 6, md: 8 }}>

          {category && (
            <Text
              fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
              textTransform="uppercase" mb={3} style={{ color: accent }}
            >
              {category}
            </Text>
          )}

          <Heading
            as="h1" id={`details-${index}`}
            fontFamily="var(--font-headline)" fontWeight="800"
            fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
            mb={5} style={{ color: accent }}
          >
            {title}
          </Heading>

          {tags && tags.length > 0 && (
            <Stack direction="row" spacing={2} mb={6} flexWrap="wrap">
              {tags.map((tag, i) => (
                <Tag
                  key={i} size="sm" borderRadius="full" px={3}
                  bg={bgFill} color={labelSecond} border="1px solid" borderColor={borderColor}
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
                sx={{ "& li": { color: labelSecond, lineHeight: "1.8", fontFamily: "var(--font-body)" } }}
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
                    style={{ color: accent }}
                  >
                    {key.replace(/_/g, " ")}
                  </Text>
                  <UnorderedList
                    spacing={2}
                    sx={{ "& li": { color: labelSecond, lineHeight: "1.8", fontSize: "sm", fontFamily: "var(--font-body)" } }}
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
            <Text fontSize="sm" textAlign="center" style={{ color: labelSecond }}>
              No description available.
            </Text>
          )}

          {uiGallery.length > 0 && (
            <>
              <Divider my={6} borderColor={separatorColor} />
              <Stack direction="row" align="center" spacing={2} mb={4}>
                <Icon as={FaDesktop} style={{ color: accent }} />
                <Text
                  fontSize="xs" fontFamily="var(--font-label)" fontWeight={700}
                  letterSpacing="widest" textTransform="uppercase" style={{ color: accent }}
                >
                  User Interface
                </Text>
              </Stack>
              <Box bg={bgGrouped} borderRadius="12px" p={4} border="1px solid" borderColor={borderColor}>
                <ImageGallery images={uiGallery} title={title} onZoom={openZoom} />
              </Box>
            </>
          )}

          {(reference || repo) && (
            <>
              <Divider my={6} borderColor={separatorColor} />
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
