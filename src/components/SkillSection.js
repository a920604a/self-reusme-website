import React from "react";
import {
  Box, Heading, Text, VStack, Flex,
  Progress, SimpleGrid, HStack, Image as ChakraImage,
} from "@chakra-ui/react";

const Icons = {
  skills: {
    Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  tools: {
    Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    MySQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    SQLite: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
    Redis: "https://cdn.jsdelivr.net/npm/node-red-contrib-redis@1.3.9/icons/redis.png",
    MongoDB: "https://raw.githubusercontent.com/devicons/devicon/v2.16.0/icons/mongodb/mongodb-original.svg",
    Unity: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
    Figma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    Ansible: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg",
    Airflow: "https://raw.githubusercontent.com/devicons/devicon/refs/tags/v2.16.0/icons/apacheairflow/apacheairflow-original.svg",
    Ubuntu: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg",
  },
  frameworks: {
    React: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    FastAPI: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    PyTorch: "https://pytorch.org/assets/images/pytorch-logo.png",
  },
};

const SectionCard = ({ title, children }) => (
  <Box
    bg="white"
    borderRadius="12px"
    p={6}
    boxShadow="0 2px 12px rgba(0,0,0,0.06)"
    border="1px solid"
    borderColor="gray.100"
    h="100%"
  >
    <Heading as="h3" size="sm" color="teal.600" fontWeight={700} mb={5} letterSpacing="wide" textTransform="uppercase">
      {title}
    </Heading>
    {children}
  </Box>
);

const ToolIcon = ({ src, name }) => (
  <VStack spacing={1} align="center" w="60px">
    <ChakraImage
      src={src}
      alt={name}
      w="28px"
      h="28px"
      objectFit="contain"
      fallback={<Box w="28px" h="28px" bg="gray.200" borderRadius="4px" />}
    />
    <Text fontSize="9px" color="gray.500" textAlign="center" lineHeight="1.2" noOfLines={2}>
      {name}
    </Text>
  </VStack>
);

const SkillSection = ({ skills, tools, frameworks }) => {
  return (
    <Box
      as="section"
      id="skills-section"
      bg="#f0fdf4"
      py={{ base: 12, md: 16 }}
      px={{ base: 4, md: 8, lg: 16 }}
    >
      <Box maxW="1280px" mx="auto">
        <Heading as="h2" size="lg" mb={2} textAlign="center" color="gray.800" fontWeight={700}>
          Skills
        </Heading>
        <Text textAlign="center" color="gray.500" mb={10} fontSize="sm">
          Technologies &amp; tools I work with
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          {/* Skills with progress bars */}
          <SectionCard title="Programming">
            <VStack spacing={4} align="stretch">
              {skills.map((skill, i) => (
                <Box key={i}>
                  <HStack justify="space-between" mb={1}>
                    <HStack spacing={2}>
                      <ChakraImage
                        src={Icons.skills[skill.name]}
                        alt={skill.name}
                        w="16px"
                        h="16px"
                        objectFit="contain"
                      />
                      <Text fontSize="sm" fontWeight={600} color="gray.700">{skill.name}</Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.400">{skill.level}</Text>
                  </HStack>
                  <Progress
                    value={parseInt(skill.level)}
                    colorScheme="teal"
                    size="xs"
                    borderRadius="full"
                    bg="gray.100"
                  />
                </Box>
              ))}
            </VStack>
          </SectionCard>

          {/* Tools as icon grid */}
          <SectionCard title="Tools">
            <Flex flexWrap="wrap" gap={4}>
              {tools.map((tool, i) => (
                <ToolIcon key={i} src={Icons.tools[tool]} name={tool} />
              ))}
            </Flex>
          </SectionCard>

          {/* Frameworks as icon grid */}
          <SectionCard title="Frameworks">
            <Flex flexWrap="wrap" gap={4}>
              {frameworks.map((fw, i) => (
                <ToolIcon key={i} src={Icons.frameworks[fw]} name={fw} />
              ))}
            </Flex>
          </SectionCard>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default SkillSection;
