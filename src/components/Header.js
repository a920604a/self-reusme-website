import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faMedium,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";
import { Box, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom"; // 使用 React Router 的 Link

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
  // 處理滾動到特定區域的功能
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
    <a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={social.icon} size="2x" />
    </a>
  ));

  // 處理 Header 顯示/隱藏的動畫
  const headerRef = useRef(null);

  useEffect(() => {
    let prevScrollPos = window.scrollY;

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

    window.addEventListener("scroll", handleScroll);

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
              {/* Replace <a> with Link to handle routing within React */}
              <Link to="/" onClick={handleClick('')} className="nav-item">
                Home
              </Link>
              <Link to="/#projects" onClick={handleClick('projects')} className="nav-item">
                Projects
              </Link>
              <Link to="/#work-experience" onClick={handleClick('work-experience')} className="nav-item">
                Experiences
              </Link>
              <Link to="/#skills" onClick={handleClick('skills')} className="nav-item">
                Skills
              </Link>
              <Link to="/#education" onClick={handleClick('education')} className="nav-item">
                Education
              </Link>
            </HStack>
          </nav>
        </HStack>
      </Box>
    </Box>
  );
};

export default Header;
