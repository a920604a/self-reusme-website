import React from "react";
import {
  Box, Heading, Text, VStack, Flex, Progress, SimpleGrid,
  HStack, Image as ChakraImage,
} from "@chakra-ui/react";

const Icons = {
  skills: {
    Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    "Shell Script": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
  },
  tools: {
    Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    MySQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    Redis: "https://cdn.jsdelivr.net/npm/node-red-contrib-redis@1.3.9/icons/redis.png",
    MongoDB: "https://raw.githubusercontent.com/devicons/devicon/v2.16.0/icons/mongodb/mongodb-original.svg",
    Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    Ansible: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg",
    Airflow: "https://raw.githubusercontent.com/devicons/devicon/refs/tags/v2.16.0/icons/apacheairflow/apacheairflow-original.svg",
    Ubuntu: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg",
    Prometheus: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg",
    Grafana: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg",
    GCP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    MLflow: "https://raw.githubusercontent.com/mlflow/mlflow/master/assets/logo.svg",
    Unity: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
  },
  frameworks: {
    React: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    FastAPI: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    PyTorch: "https://pytorch.org/assets/images/pytorch-logo.png",
    Flask: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  },
};

const SectionCard = ({ title, accentColor = "#c0c1ff", children }) => (
  <Box
    bg="#171f33"
    borderRadius="16px"
    p={6}
    border="1px solid #464554"
    h="100%"
  >
    <Heading
      as="h3"
      fontSize="xs"
      fontFamily="var(--font-label)"
      fontWeight={700}
      letterSpacing="widest"
      textTransform="uppercase"
      mb={5}
      style={{ color: accentColor }}
    >
      {title}
    </Heading>
    {children}
  </Box>
);

const ToolIcon = ({ src, name }) => (
  <VStack spacing={1} align="center" w="56px">
    <ChakraImage
      src={src}
      alt={name}
      w="26px"
      h="26px"
      objectFit="contain"
      fallback={<Box w="26px" h="26px" bg="#222a3d" borderRadius="4px" />}
    />
    <Text
      fontSize="9px"
      textAlign="center"
      lineHeight="1.2"
      noOfLines={2}
      fontFamily="var(--font-label)"
      style={{ color: "#908fa0" }}
    >
      {name}
    </Text>
  </VStack>
);

const SkillSection = ({ skills, tools, frameworks, tryLearn }) => (
  <Box
    as="section"
    id="skills-section"
    bg="#131b2e"
    py={{ base: 16, md: 24 }}
    px={{ base: 4, md: 8 }}
  >
    <Box maxW="1100px" mx="auto">

      {/* Header */}
      <Box mb={{ base: 10, md: 14 }} textAlign="center">
        <Text
          fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
          textTransform="uppercase" mb={3} style={{ color: "#5de6ff" }}
        >
          Technical
        </Text>
        <Heading
          fontFamily="var(--font-headline)" fontWeight="800"
          fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
          style={{ color: "#dae2fd" }}
        >
          Skills & Tools
        </Heading>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>

        {/* Languages */}
        <SectionCard title="Languages" accentColor="#c0c1ff">
          <VStack spacing={4} align="stretch">
            {skills.map((skill) => (
              <Box key={skill.name}>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="sm" fontFamily="var(--font-body)" style={{ color: "#dae2fd" }}>
                    {skill.name}
                  </Text>
                  <Text fontSize="xs" fontFamily="var(--font-label)" style={{ color: "#c0c1ff" }}>
                    {skill.level}
                  </Text>
                </Flex>
                <Progress
                  value={parseInt(skill.level)}
                  size="xs"
                  borderRadius="full"
                  bg="#222a3d"
                  sx={{
                    "& > div": {
                      background: "linear-gradient(90deg, #c0c1ff, #8083ff)",
                    },
                  }}
                />
              </Box>
            ))}
          </VStack>
        </SectionCard>

        {/* Tools */}
        <SectionCard title="Tools & Infrastructure" accentColor="#5de6ff">
          <Flex wrap="wrap" gap={3}>
            {tools.map((tool) => (
              <ToolIcon key={tool} src={Icons.tools[tool]} name={tool} />
            ))}
          </Flex>
        </SectionCard>

        {/* Frameworks + Learning */}
        <VStack spacing={6} align="stretch">
          <SectionCard title="Frameworks" accentColor="#ffb783">
            <Flex wrap="wrap" gap={3}>
              {frameworks.map((fw) => (
                <ToolIcon key={fw} src={Icons.frameworks[fw]} name={fw} />
              ))}
            </Flex>
          </SectionCard>

          {tryLearn && tryLearn.length > 0 && (
            <Box
              bg="#131b2e"
              borderRadius="16px"
              p={5}
              border="1px solid #464554"
              borderStyle="dashed"
            >
              <Text
                fontSize="xs"
                fontFamily="var(--font-label)"
                fontWeight={700}
                letterSpacing="widest"
                textTransform="uppercase"
                mb={3}
                style={{ color: "#908fa0" }}
              >
                Exploring
              </Text>
              <Flex wrap="wrap" gap={2}>
                {tryLearn.map((item) => (
                  <Box
                    key={item}
                    px={3} py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontFamily="var(--font-label)"
                    bg="#222a3d"
                    style={{ color: "#c7c4d7" }}
                    border="1px solid #464554"
                  >
                    {item}
                  </Box>
                ))}
              </Flex>
            </Box>
          )}
        </VStack>
      </SimpleGrid>
    </Box>
  </Box>
);

export default SkillSection;
