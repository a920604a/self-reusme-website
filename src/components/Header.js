import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faMedium,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";
import { Box, HStack, Heading } from "@chakra-ui/react";

const socials = [
  {
    icon: faEnvelope,
    url: "mailto: a920604a@gamil.com",
  },
  {
    icon: faGithub,
    url: "https://github.com/a920604a",
  },
  {
    icon: faLinkedin,
    url: "https://www.linkedin.com/in/chen-yuan-2b4b7212b/",
  },
  {
    icon: faMedium,
    url: "https://medium.com/@a920604a",
  },
  {
    icon: faStackOverflow,
    url: "https://stackoverflow.com/users/22876310/a920604a",
  },
];

const Header = () => {
  const handleClick = (anchor) => () => {
    const id = `${anchor}-section`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const listItem = socials.map((social) => (
    <a key={social.url} href={social.url}>
      <FontAwesomeIcon icon={social.icon} size="2x" />
    </a>
  ));

  // Handle header show/hide animation depending on the scroll direction
  const headerRef = useRef(null);

  useEffect(() => {
    let prevScrollPos = window.scrollY;

    // Handle scroll events
    const handleScroll = () => {
      const currScrollPos = window.scrollY;
      const currHeaderElement = headerRef.current;

      if (!currHeaderElement) {
        return;
      }


      if (prevScrollPos > currScrollPos) {
        currHeaderElement.style.transform = "translateY(0)";
      } else {
        currHeaderElement.style.transform = "translateY(-200px)";
      }

      prevScrollPos = currScrollPos;
    };

    // Set up listeners for the scroll event
    window.addEventListener("scroll", handleScroll);

    // Remove listeners for the scroll event
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (

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
    >
      <Box color="white" maxWidth="1280px" margin="0 auto">
        <HStack
          px={16}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <nav>
            <HStack spacing={8}>
              {/* Add social media links based on the `socials` data */}
              {listItem}
            </HStack>
          </nav>
          <nav>
            <HStack spacing={8}>
              {/* Add links to Projects and Contact me section */}
              <a href="/" className="nav-item" onClick={handleClick('')}>Home</a>
              <a href="#projects" className="nav-item" onClick={handleClick('projects')}>Projects</a>
              <a href="#work-experience" className="nav-item" onClick={handleClick('work-experience')}>Experiences</a>
              <a href="#skills" className="nav-item" onClick={handleClick('skills')}>Skills</a>
              <a href="#Education" className="nav-item" onClick={handleClick('education')}>Education</a>
              {/* <a href="#contact-me" className="nav-item" onClick={handleClick('contactme')}>Contact Me</a> */}
            </HStack>
          </nav>
        </HStack>
      </Box>

      <header>

      </header>

    </Box>
  );
};
export default Header;
