import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faBars } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faMedium } from "@fortawesome/free-brands-svg-icons";
import {
  Box, Flex, HStack, Text, VStack,
  IconButton,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  useDisclosure, useBreakpointValue,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

const socials = (email) => [
  { icon: faEnvelope, url: `mailto:${email || 'a920604a@gmail.com'}`,          label: "Email" },
  { icon: faGithub,   url: "https://github.com/a920604a",                      label: "GitHub" },
  { icon: faLinkedin, url: "https://www.linkedin.com/in/chen-yuan-2b4b7212b/", label: "LinkedIn" },
  { icon: faMedium,   url: "https://medium.com/@a920604a",                     label: "Medium" },
];

const navItems = [
  { label: "Home",       to: "/",                 anchor: "" },
  { label: "Projects",   to: "/#projects",        anchor: "projects" },
  { label: "Experience", to: "/#work-experience", anchor: "work-experience" },
  { label: "Skills",     to: "/#skills",          anchor: "skills" },
];

const Header = ({ email }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headerRef = useRef(null);
  const location = useLocation();

  const scrollTo = (anchor) => {
    onClose();
    if (!anchor) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = document.getElementById(`${anchor}-section`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    let prev = window.scrollY;
    const onScroll = () => {
      const curr = window.scrollY;
      if (headerRef.current)
        headerRef.current.style.transform =
          prev > curr || curr < 60 ? "translateY(0)" : "translateY(-80px)";
      prev = curr;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a href="#main-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}
        onFocus={(e) => { e.target.style.left = "0"; e.target.style.width = "auto"; e.target.style.height = "auto"; }}>
        Skip to content
      </a>

      <Box as="nav" className="glass-nav" position="fixed" top={0} left={0} right={0} zIndex={1000}
        ref={headerRef} style={{ transition: "transform 0.3s ease-in-out" }}>
        <Flex maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} h="70px" align="center" justify="space-between">

          {/* Logo */}
          <Link to="/" onClick={() => scrollTo("")} style={{ textDecoration: "none" }}>
            <Text fontFamily="var(--font-headline)" fontWeight="900" fontSize="xl"
              letterSpacing="-0.03em" style={{ color: "#c0c1ff" }}>
              YA·Dev
            </Text>
          </Link>

          {/* Desktop nav */}
          {!isMobile && (
            <HStack spacing={8}>
              {navItems.map((item) => (
                <Link key={item.label} to={item.to} onClick={() => scrollTo(item.anchor)}
                  style={{
                    color: location.hash === `#${item.anchor}` || (item.anchor === "" && location.pathname === "/" && !location.hash)
                      ? "#c0c1ff" : "#94a3b8",
                    fontFamily: "var(--font-headline)", fontWeight: 600, fontSize: "0.875rem",
                    textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => { if (e.currentTarget.style.color !== "#c0c1ff") e.currentTarget.style.color = "#dae2fd"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = location.hash === `#${item.anchor}` || (item.anchor === "" && location.pathname === "/" && !location.hash) ? "#c0c1ff" : "#94a3b8"; }}
                >
                  {item.label}
                </Link>
              ))}
            </HStack>
          )}

          {/* Right: socials or hamburger */}
          <HStack spacing={4}>
            {!isMobile && (
              <HStack spacing={4}>
                {socials(email).map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ color: "#908fa0", fontSize: "14px", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#c0c1ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#908fa0")}>
                    <FontAwesomeIcon icon={s.icon} />
                  </a>
                ))}
              </HStack>
            )}
            {isMobile && (
              <IconButton icon={<FontAwesomeIcon icon={faBars} />} aria-label="Open menu"
                variant="ghost" size="sm" color="#908fa0"
                _hover={{ color: "#c0c1ff", bg: "rgba(192,193,255,0.05)" }} onClick={onOpen} />
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay bg="rgba(6,14,32,0.75)" />
        <DrawerContent bg="#131b2e" color="#dae2fd" borderLeft="1px solid #464554">
          <DrawerCloseButton color="#908fa0" _hover={{ color: "#c0c1ff" }} />
          <DrawerHeader borderBottomWidth="1px" borderColor="#464554"
            fontFamily="var(--font-headline)" fontWeight="900" color="#c0c1ff" letterSpacing="-0.03em">
            YA·Dev
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={1} align="stretch" mt={4}>
              {navItems.map((item) => (
                <Box key={item.label} as={Link} to={item.to} onClick={() => scrollTo(item.anchor)}
                  px={3} py={3} borderRadius="md"
                  fontFamily="var(--font-headline)" fontWeight={600} fontSize="1rem"
                  display="block"
                  style={{ color: "#c7c4d7", textDecoration: "none" }}
                  _hover={{ color: "#c0c1ff", bg: "rgba(192,193,255,0.06)", textDecoration: "none" }}>
                  {item.label}
                </Box>
              ))}
              <Box pt={6} borderTop="1px solid #464554" mt={4}>
                <Text fontSize="xs" fontFamily="var(--font-label)" color="#464554"
                  letterSpacing="widest" textTransform="uppercase" mb={3}>
                  Connect
                </Text>
                <HStack spacing={5}>
                  {socials(email).map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                      aria-label={s.label} style={{ color: "#908fa0", fontSize: "18px" }}>
                      <FontAwesomeIcon icon={s.icon} />
                    </a>
                  ))}
                </HStack>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
