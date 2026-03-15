import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faMedium,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";
import {
  Box,
  HStack,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const socials = [
  {
    icon: faEnvelope,
    url: "mailto:a920604a@gmail.com",
    label: "Send email",
  },
  {
    icon: faGithub,
    url: "https://github.com/a920604a",
    label: "GitHub profile",
  },
  {
    icon: faLinkedin,
    url: "https://www.linkedin.com/in/chen-yuan-2b4b7212b/",
    label: "LinkedIn profile",
  },
  {
    icon: faMedium,
    url: "https://medium.com/@a920604a",
    label: "Medium blog",
  },
  {
    icon: faStackOverflow,
    url: "https://stackoverflow.com/users/22876310/a920604a",
    label: "Stack Overflow profile",
  },
];

const navItems = [
  { label: "Home", to: "/", anchor: "" },
  { label: "Projects", to: "/#projects", anchor: "projects" },
  { label: "Experiences", to: "/#work-experience", anchor: "work-experience" },
  { label: "Skills", to: "/#skills", anchor: "skills" },
  { label: "Education", to: "/#education", anchor: "education" },
];

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headerRef = useRef(null);

  const handleClick = (anchor) => () => {
    onClose();
    const id = `${anchor}-section`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const handleScroll = () => {
      const currScrollPos = window.scrollY;
      const currHeaderElement = headerRef.current;
      if (!currHeaderElement) return;
      if (prevScrollPos > currScrollPos) {
        currHeaderElement.style.transform = "translateY(0)";
      } else {
        currHeaderElement.style.transform = "translateY(-200px)";
      }
      prevScrollPos = currScrollPos;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socialLinks = socials.map((social) => (
    <a
      key={social.url}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      style={{ color: "white" }}
    >
      <FontAwesomeIcon icon={social.icon} size="2x" />
    </a>
  ));

  return (
    <>
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
        onFocus={(e) => { e.target.style.left = "0"; e.target.style.width = "auto"; e.target.style.height = "auto"; }}
      >
        Skip to content
      </a>

      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        translateY={0}
        transitionProperty="transform"
        transitionDuration=".3s"
        transitionTimingFunction="ease-in-out"
        backgroundColor="#18181b"
        ref={headerRef}
        zIndex={1000}
      >
        <Box color="white" maxWidth="1280px" margin="0 auto">
          <HStack px={{ base: 4, md: 16 }} py={4} justifyContent="space-between" alignItems="center">
            {/* Social links — hidden on mobile */}
            <nav aria-label="Social links">
              <HStack spacing={6} display={{ base: "none", md: "flex" }}>
                {socialLinks}
              </HStack>
            </nav>

            {/* Desktop nav */}
            <nav aria-label="Main navigation">
              <HStack spacing={8} display={{ base: "none", md: "flex" }}>
                {navItems.map((item) => (
                  <Link key={item.label} to={item.to} onClick={handleClick(item.anchor)} className="nav-item">
                    {item.label}
                  </Link>
                ))}
              </HStack>
            </nav>

            {/* Mobile hamburger */}
            {isMobile && (
              <IconButton
                icon={<FontAwesomeIcon icon={faBars} />}
                aria-label="Open navigation menu"
                variant="ghost"
                color="white"
                fontSize="20px"
                onClick={onOpen}
                _hover={{ bg: "whiteAlpha.200" }}
              />
            )}
          </HStack>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#18181b" color="white">
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.300">
            Menu
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch" mt={4}>
              <VStack spacing={4} align="stretch">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={handleClick(item.anchor)}
                    style={{ fontSize: "1.1rem", fontWeight: "500" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </VStack>

              <Box borderTopWidth="1px" borderColor="whiteAlpha.300" pt={4}>
                <HStack spacing={5} justify="center">
                  {socialLinks}
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
