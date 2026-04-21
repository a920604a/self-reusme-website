import React from "react";
import { Box, Flex, Text, HStack, Link as ChakraLink, useColorModeValue } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faMedium } from "@fortawesome/free-brands-svg-icons";

const socials = [
  { icon: faGithub,   url: "https://github.com/a920604a",                      label: "GitHub" },
  { icon: faLinkedin, url: "https://www.linkedin.com/in/chen-yuan-2b4b7212b/", label: "LinkedIn" },
  { icon: faMedium,   url: "https://medium.com/@a920604a",                     label: "Medium" },
  { icon: faEnvelope, url: "mailto:a920604a@gmail.com",                        label: "Email" },
];

const Footer = () => {
  const bgFooter      = useColorModeValue("#F2F2F7", "#1C1C1E");
  const borderColor   = useColorModeValue("rgba(60,60,67,0.29)", "rgba(84,84,88,0.65)");
  const accent        = useColorModeValue("#007AFF", "#0A84FF");
  const labelTertiary = useColorModeValue("rgba(60,60,67,0.3)", "rgba(235,235,245,0.3)");

  return (
    <Box as="footer" bg={bgFooter} borderTop="1px solid" borderColor={borderColor} py={10}>
      <Flex
        maxW="1280px"
        mx="auto"
        px={{ base: 6, md: 8 }}
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        gap={6}
      >
        {/* Branding */}
        <Box>
          <Text
            fontFamily="var(--font-headline)"
            fontWeight="900"
            fontSize="lg"
            letterSpacing="-0.03em"
            color={accent}
            mb={1}
          >
            YA·Dev
          </Text>
          <Text
            fontFamily="var(--font-label)"
            fontSize="xs"
            letterSpacing="widest"
            textTransform="uppercase"
            color={labelTertiary}
          >
            © {new Date().getFullYear()} Yu-An Chen · Engineered with care.
          </Text>
        </Box>

        {/* Links */}
        <HStack spacing={6} align="center">
          {socials.map((s) => (
            <ChakraLink
              key={s.url}
              href={s.url}
              isExternal
              aria-label={s.label}
              color={labelTertiary}
              _hover={{ color: accent }}
              fontSize="16px"
              transition="color 0.2s"
            >
              <FontAwesomeIcon icon={s.icon} />
            </ChakraLink>
          ))}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: accent,
              fontFamily: "var(--font-label)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            ↑ Top
          </button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Footer;
