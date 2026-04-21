import React from "react";
import {
  Box, Heading, Text, VStack, Flex, Progress, SimpleGrid,
  HStack, Image as ChakraImage, useColorModeValue,
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

const SectionCard = ({ title, children }) => {
  const bg          = useColorModeValue("#FFFFFF", "#2C2C2E");
  const borderColor = useColorModeValue("#C6C6C8", "#38383A");
  const accent      = useColorModeValue("#007AFF", "#0A84FF");
  return (
    <Box bg={bg} borderRadius="16px" p={6} border="1px solid" borderColor={borderColor} h="100%">
      <Heading as="h3" fontSize="xs" fontFamily="var(--font-label)" fontWeight={700}
        letterSpacing="widest" textTransform="uppercase" mb={5} style={{ color: accent }}>
        {title}
      </Heading>
      {children}
    </Box>
  );
};

const ToolIcon = ({ src, name, bgFill, labelSecond }) => (
  <VStack spacing={1} align="center" w="56px">
    <ChakraImage
      src={src}
      alt={name}
      w="26px"
      h="26px"
      objectFit="contain"
      fallback={<Box w="26px" h="26px" bg={bgFill} borderRadius="4px" />}
    />
    <Text
      fontSize="9px"
      textAlign="center"
      lineHeight="1.2"
      noOfLines={2}
      fontFamily="var(--font-label)"
      style={{ color: labelSecond }}
    >
      {name}
    </Text>
  </VStack>
);

const SkillSection = ({ skills, tools, frameworks, tryLearn }) => {
  const bgSection    = useColorModeValue("#F2F2F7", "#1C1C1E");
  const labelPrimary = useColorModeValue("#000000", "#FFFFFF");
  const labelSecond  = useColorModeValue("rgba(60,60,67,0.6)", "rgba(235,235,245,0.6)");
  const accent       = useColorModeValue("#007AFF", "#0A84FF");
  const bgFill       = useColorModeValue("rgba(120,120,128,0.2)", "rgba(120,120,128,0.36)");
  const borderColor  = useColorModeValue("#C6C6C8", "#38383A");
  const progressGrad = useColorModeValue(
    "linear-gradient(90deg, #007AFF, #34AADC)",
    "linear-gradient(90deg, #0A84FF, #64D2FF)"
  );

  return (
  <Box
    as="section"
    id="skills-section"
    bg={bgSection}
    py={{ base: 16, md: 24 }}
    px={{ base: 4, md: 8 }}
  >
    <Box maxW="1100px" mx="auto">

      {/* Header */}
      <Box mb={{ base: 10, md: 14 }} textAlign="center">
        <Text
          fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
          textTransform="uppercase" mb={3} style={{ color: accent }}
        >
          Technical
        </Text>
        <Heading
          fontFamily="var(--font-headline)" fontWeight="800"
          fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
          style={{ color: labelPrimary }}
        >
          Skills & Tools
        </Heading>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>

        {/* Languages */}
        <SectionCard title="Languages">
          <VStack spacing={4} align="stretch">
            {skills.map((skill) => (
              <Box key={skill.name}>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="sm" fontFamily="var(--font-body)" style={{ color: labelPrimary }}>
                    {skill.name}
                  </Text>
                  <Text fontSize="xs" fontFamily="var(--font-label)" style={{ color: accent }}>
                    {skill.level}
                  </Text>
                </Flex>
                <Progress
                  value={parseInt(skill.level)}
                  size="xs"
                  borderRadius="full"
                  bg={bgFill}
                  sx={{
                    "& > div": {
                      background: progressGrad,
                    },
                  }}
                />
              </Box>
            ))}
          </VStack>
        </SectionCard>

        {/* Tools */}
        <SectionCard title="Tools & Infrastructure">
          <Flex wrap="wrap" gap={3}>
            {tools.map((tool) => (
              <ToolIcon key={tool} src={Icons.tools[tool]} name={tool} bgFill={bgFill} labelSecond={labelSecond} />
            ))}
          </Flex>
        </SectionCard>

        {/* Frameworks + Learning */}
        <VStack spacing={6} align="stretch">
          <SectionCard title="Frameworks">
            <Flex wrap="wrap" gap={3}>
              {frameworks.map((fw) => (
                <ToolIcon key={fw} src={Icons.frameworks[fw]} name={fw} bgFill={bgFill} labelSecond={labelSecond} />
              ))}
            </Flex>
          </SectionCard>

          {tryLearn && tryLearn.length > 0 && (
            <Box
              bg="#131b2e"
              borderRadius="16px"
              p={5}
              border="1px solid" borderColor={borderColor}
              borderStyle="dashed"
            >
              <Text
                fontSize="xs"
                fontFamily="var(--font-label)"
                fontWeight={700}
                letterSpacing="widest"
                textTransform="uppercase"
                mb={3}
                style={{ color: labelSecond }}
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
                    bg={bgFill}
                    style={{ color: labelSecond }}
                    border="1px solid" borderColor={borderColor}
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
};

export default SkillSection;
