import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faBars, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faMedium } from "@fortawesome/free-brands-svg-icons";
import {
  Box, Flex, HStack, Text, VStack,
  IconButton, Button,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  useDisclosure, useBreakpointValue, useColorMode, useColorModeValue,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useLocaleContext } from "../context/LocaleContext";

const socials = (email) => [
  { icon: faEnvelope, url: `mailto:${email || 'a920604a@gmail.com'}`,          label: "Email" },
  { icon: faGithub,   url: "https://github.com/a920604a",                      label: "GitHub" },
  { icon: faLinkedin, url: "https://www.linkedin.com/in/chen-yuan-2b4b7212b/", label: "LinkedIn" },
  { icon: faMedium,   url: "https://medium.com/@a920604a",                     label: "Medium" },
];

const Header = ({ email }) => {
  const { t, locale, setLocale } = useLocaleContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headerRef = useRef(null);
  const location = useLocation();
  const { toggleColorMode, colorMode } = useColorMode();
  const accent       = useColorModeValue("#007AFF", "#0A84FF");
  const navColor     = useColorModeValue("#000000", "#FFFFFF");
  const navSubColor  = useColorModeValue("rgba(60,60,67,0.6)", "rgba(235,235,245,0.6)");
  const drawerBg     = useColorModeValue("#FFFFFF", "#1C1C1E");
  const drawerBorder = useColorModeValue("rgba(60,60,67,0.29)", "rgba(84,84,88,0.65)");

  const navItems = [
    { label: t('nav.home'),       to: "/",          anchor: "" },
    { label: t('nav.projects'),   to: "/#projects", anchor: "projects" },
    { label: t('nav.experience'), to: "/#work-experience", anchor: "work-experience" },
    { label: t('nav.skills'),     to: "/#skills",   anchor: "skills" },
    { label: t('nav.aiLab'),      to: "/ai-lab",    anchor: "ai-lab" },
  ];

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
              letterSpacing="-0.03em" style={{ color: accent }}>
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
                      ? accent : navSubColor,
                    fontFamily: "var(--font-headline)", fontWeight: 600, fontSize: "0.875rem",
                    textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = navColor; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = location.hash === `#${item.anchor}` || (item.anchor === "" && location.pathname === "/" && !location.hash) ? accent : navSubColor; }}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
                  color={navSubColor}
                  _hover={{ color: accent, bg: "transparent" }}
                  fontFamily="var(--font-label)"
                  fontSize="xs"
                  fontWeight="700"
                >
                  {locale === 'zh' ? 'EN' : '繁中'}
                </Button>
                {socials(email).map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ color: navSubColor, fontSize: "14px", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = navSubColor)}>
                    <FontAwesomeIcon icon={s.icon} />
                  </a>
                ))}
                <IconButton
                  icon={<FontAwesomeIcon icon={colorMode === "dark" ? faSun : faMoon} />}
                  aria-label="Toggle color mode"
                  variant="ghost"
                  size="sm"
                  onClick={toggleColorMode}
                  color={navSubColor}
                  _hover={{ color: accent, bg: "transparent" }}
                />
              </HStack>
            )}
            {isMobile && (
              <HStack spacing={2}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
                  color={navSubColor}
                  _hover={{ color: accent, bg: "transparent" }}
                  fontFamily="var(--font-label)"
                  fontSize="xs"
                  fontWeight="700"
                >
                  {locale === 'zh' ? 'EN' : '繁中'}
                </Button>
                <IconButton
                  icon={<FontAwesomeIcon icon={colorMode === "dark" ? faSun : faMoon} />}
                  aria-label="Toggle color mode"
                  variant="ghost"
                  size="sm"
                  onClick={toggleColorMode}
                  color={navSubColor}
                  _hover={{ color: accent, bg: "transparent" }}
                />
                <IconButton icon={<FontAwesomeIcon icon={faBars} />} aria-label="Open menu"
                  variant="ghost" size="sm" color={navSubColor}
                  _hover={{ color: accent, bg: "transparent" }} onClick={onOpen} />
              </HStack>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay bg="rgba(6,14,32,0.75)" />
        <DrawerContent bg={drawerBg} color={navColor} borderLeft="1px solid" borderColor={drawerBorder}>
          <DrawerCloseButton color={navSubColor} _hover={{ color: accent }} />
          <DrawerHeader borderBottomWidth="1px" borderColor={drawerBorder}
            fontFamily="var(--font-headline)" fontWeight="900" color={accent} letterSpacing="-0.03em">
            YA·Dev
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={1} align="stretch" mt={4}>
              {navItems.map((item) => (
                <Box key={item.label} as={Link} to={item.to} onClick={() => scrollTo(item.anchor)}
                  px={3} py={3} borderRadius="md"
                  fontFamily="var(--font-headline)" fontWeight={600} fontSize="1rem"
                  display="block"
                  style={{ color: navColor, textDecoration: "none" }}
                  _hover={{ color: accent, bg: "var(--color-fill)", textDecoration: "none" }}>
                  {item.label}
                </Box>
              ))}
              <Box pt={6} borderTop="1px solid #464554" mt={4}>
                <Text fontSize="xs" fontFamily="var(--font-label)" color={navSubColor}
                  letterSpacing="widest" textTransform="uppercase" mb={3}>
                  Connect
                </Text>
                <HStack spacing={5}>
                  {socials(email).map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                      aria-label={s.label} style={{ color: navSubColor, fontSize: "18px" }}>
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
