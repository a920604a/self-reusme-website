import React from "react";
import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faMedium } from "@fortawesome/free-brands-svg-icons";

const socials = [
  { icon: faGithub,   url: "https://github.com/a920604a",                      label: "GitHub" },
  { icon: faLinkedin, url: "https://www.linkedin.com/in/chen-yuan-2b4b7212b/", label: "LinkedIn" },
  { icon: faMedium,   url: "https://medium.com/@a920604a",                     label: "Medium" },
  { icon: faEnvelope, url: "mailto:a920604a@gmail.com",                        label: "Email" },
];

const Footer = () => (
  <Box as="footer" bg="#060e20" borderTop="1px solid #1e2740" py={10}>
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
          color="#c0c1ff"
          mb={1}
        >
          YA·Dev
        </Text>
        <Text
          fontFamily="var(--font-label)"
          fontSize="xs"
          letterSpacing="widest"
          textTransform="uppercase"
          color="#464554"
        >
          © {new Date().getFullYear()} Yu-An Chen · Engineered with care.
        </Text>
      </Box>

      {/* Links */}
      <HStack spacing={6} align="center">
        {socials.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            style={{ color: "#464554", fontSize: "16px", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#5de6ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#464554")}
          >
            <FontAwesomeIcon icon={s.icon} />
          </a>
        ))}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#c0c1ff",
            fontFamily: "var(--font-label)",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#5de6ff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#c0c1ff")}
        >
          ↑ Top
        </button>
      </HStack>
    </Flex>
  </Box>
);

export default Footer;
