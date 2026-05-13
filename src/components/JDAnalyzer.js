import React, { useEffect, useRef } from 'react';
import {
  Box, Button, Flex, Text, Textarea, VStack, HStack,
  useColorModeValue, Icon, Heading, Badge,
  Tooltip, IconButton,
} from '@chakra-ui/react';
import {
  FaMagic, FaTrash, FaFileAlt, FaRobot, FaCheckCircle,
  FaLightbulb, FaStop, FaArrowRight
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import useJDAnalysis from '../hooks/useJDAnalysis';
import useUsage from '../hooks/useUsage';
import { useLocaleContext } from '../context/LocaleContext';

const MAX_CHARS = 5000;

function JDAnalyzer({ projectIds = [] }) {
  const { t } = useLocaleContext();
  const [jd, setJd] = React.useState('');
  const { result, isStreaming, error, analyze, stop, remaining: analyzeRemaining } = useJDAnalysis();
  const { usage } = useUsage();
  const remaining = analyzeRemaining ?? usage?.analyzeJD?.remaining ?? null;
  const exhausted = remaining !== null && remaining <= 0;
  const resultRef = useRef(null);

  const accent = useColorModeValue('#007AFF', '#0A84FF');
  const accentSoft = useColorModeValue('rgba(0,122,255,0.08)', 'rgba(10,132,255,0.15)');
  const borderColor = useColorModeValue('rgba(60,60,67,0.12)', 'rgba(84,84,88,0.4)');
  const textSecondary = useColorModeValue('rgba(60,60,67,0.6)', 'rgba(235,235,245,0.6)');
  const cardBg = useColorModeValue('rgba(255,255,255,0.8)', 'rgba(28,28,30,0.8)');
  const elevatedBg = useColorModeValue('#FFFFFF', '#1C1C1E');

  // Scroll to result when streaming starts
  useEffect(() => {
    if (isStreaming && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isStreaming]);

  // Highlight relevant projects after streaming completes
  useEffect(() => {
    if (isStreaming || !result) return;
    const lower = result.toLowerCase();
    for (const id of projectIds) {
      if (lower.includes(id.toLowerCase())) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('rag-glow');
          setTimeout(() => el.classList.remove('rag-glow'), 3000);
          break;
        }
      }
    }
  }, [isStreaming, result, projectIds]);

  const handleAnalyze = () => {
    if (!jd.trim() || isStreaming || exhausted) return;
    analyze(jd);
  };

  const handleClear = () => {
    setJd('');
  };

  const charsLeft = MAX_CHARS - jd.length;
  const isOverLimit = jd.length > MAX_CHARS;

  return (
    <Box maxW="900px" mx="auto" px={{ base: 4, md: 8 }} pt="120px" pb={24} id="jd-analyzer-section">
      <VStack align="stretch" spacing={10}>

        {/* Header Section */}
        <VStack align="center" spacing={4} textAlign="center" mb={4}>
          <Badge
            px={3} py={1}
            borderRadius="full"
            bg={accentSoft}
            color={accent}
            fontFamily="var(--font-label)"
            fontSize="2xs"
            letterSpacing="widest"
            textTransform="uppercase"
          >
            {t('jdAnalyzer.badge') || 'AI-Powered Matching'}
          </Badge>
          <Heading
            fontFamily="var(--font-headline)"
            fontWeight="800"
            fontSize={{ base: '3xl', md: '5xl' }}
            letterSpacing="-0.03em"
            color="label.primary"
          >
            {t('jdAnalyzer.title') || 'JD Analyzer'}
          </Heading>
          <Text
            color="label.secondary"
            fontSize={{ base: 'md', md: 'lg' }}
            maxW="600px"
            fontFamily="var(--font-body)"
            lineHeight="tall"
          >
            {t('jdAnalyzer.subtitle') || "Paste a job description to analyze the candidate's fit using Retrieval-Augmented Generation (RAG)."}
          </Text>
        </VStack>

        {/* Input Card */}
        <Box
          bg={cardBg}
          backdropFilter="blur(20px)"
          borderRadius="24px"
          border="1px solid"
          borderColor={borderColor}
          p={{ base: 5, md: 8 }}
          boxShadow="xl"
          transition="all 0.3s ease"
          _hover={{ boxShadow: '2xl', borderColor: accent }}
        >
          <VStack align="stretch" spacing={4}>
            <Flex align="center" justify="space-between">
              <HStack spacing={2} color={accent}>
                <Icon as={FaFileAlt} />
                <Text fontWeight="700" fontSize="sm" fontFamily="var(--font-headline)">
                  {t('jdAnalyzer.inputLabel') || 'Job Description'}
                </Text>
              </HStack>
              <Tooltip label={t('jdAnalyzer.clearTooltip') || "Clear text"} placement="top">
                <IconButton
                  aria-label="Clear text"
                  icon={<FaTrash />}
                  size="xs"
                  variant="ghost"
                  onClick={handleClear}
                  isDisabled={!jd || isStreaming}
                  color={textSecondary}
                  _hover={{ color: 'red.400', bg: 'transparent' }}
                />
              </Tooltip>
            </Flex>

            <Box position="relative">
              <Textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder={t('jdAnalyzer.placeholder') || "Paste the job requirements, responsibilities, and qualifications here..."}
                minH="240px"
                maxH="500px"
                borderRadius="16px"
                bg={useColorModeValue('rgba(0,0,0,0.02)', 'rgba(255,255,255,0.02)')}
                p={4}
                fontSize="md"
                fontFamily="var(--font-body)"
                borderColor={borderColor}
                _focus={{
                  borderColor: accent,
                  boxShadow: `0 0 0 2px ${accentSoft}`,
                  bg: useColorModeValue('white', 'black'),
                }}
                isDisabled={isStreaming}
                transition="all 0.2s"
              />
              <Flex
                position="absolute"
                bottom={3}
                right={3}
                align="center"
                bg={useColorModeValue('white', 'gray.800')}
                px={2}
                py={0.5}
                borderRadius="full"
                border="1px solid"
                borderColor={borderColor}
                boxShadow="sm"
              >
                <Text fontSize="2xs" fontWeight="700" color={isOverLimit ? 'red.400' : textSecondary} fontFamily="var(--font-mono)">
                  {jd.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </Text>
              </Flex>
            </Box>

            <Flex justify="center" align="center" gap={3} pt={2} wrap="wrap">
              {isStreaming ? (
                <Button
                  onClick={stop}
                  leftIcon={<FaStop />}
                  size="lg"
                  px={8}
                  borderRadius="full"
                  variant="outline"
                  borderColor="red.400"
                  color="red.400"
                  _hover={{ bg: 'red.50', _dark: { bg: 'rgba(255,0,0,0.1)' } }}
                  fontFamily="var(--font-headline)"
                  fontWeight={700}
                >
                  {t('jdAnalyzer.stop') || 'Stop Analysis'}
                </Button>
              ) : (
                <Button
                  onClick={handleAnalyze}
                  isDisabled={!jd.trim() || isOverLimit || exhausted}
                  rightIcon={<FaArrowRight />}
                  leftIcon={<FaMagic />}
                  size="lg"
                  px={12}
                  borderRadius="full"
                  className={exhausted ? '' : 'accent-gradient'}
                  style={{ color: exhausted ? undefined : '#FFFFFF' }}
                  border="none"
                  _hover={exhausted ? {} : {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,122,255,0.4)',
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  fontFamily="var(--font-headline)"
                  fontWeight={700}
                  transition="all 0.2s"
                >
                  {t('jdAnalyzer.analyze') || 'Start Analysis'}
                </Button>
              )}
              {remaining !== null && (
                <Badge
                  px={3} py={1.5}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight={700}
                  fontFamily="var(--font-label)"
                  bg={exhausted ? 'rgba(255,149,0,0.12)' : accentSoft}
                  color={exhausted ? 'orange.400' : accent}
                  border="1px solid"
                  borderColor={exhausted ? 'orange.300' : accent}
                >
                  {exhausted ? '今日已用完' : `剩 ${remaining} 次`}
                </Badge>
              )}
            </Flex>
          </VStack>
        </Box>

        {/* Error State */}
        {error && (
          <Box
            p={4}
            borderRadius="16px"
            bg="red.50"
            _dark={{ bg: 'rgba(255,0,0,0.05)' }}
            border="1px solid"
            borderColor="red.200"
            _dark={{ borderColor: 'red.900' }}
          >
            <HStack spacing={3}>
              <Icon as={FaCheckCircle} color="red.400" />
              <Text color="red.500" fontSize="sm" fontFamily="var(--font-body)" fontWeight="500">
                {error}
              </Text>
            </HStack>
          </Box>
        )}

        {/* Result Card */}
        {(result || isStreaming) && (
          <VStack align="stretch" spacing={6} ref={resultRef}>
            <HStack spacing={3} px={2}>
              <Icon as={FaRobot} color={accent} boxSize={5} />
              <Heading size="md" fontFamily="var(--font-headline)" letterSpacing="-0.01em">
                {t('jdAnalyzer.reportTitle') || 'Analysis Report'}
              </Heading>
              {isStreaming && (
                <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={2} fontSize="2xs">
                  {t('jdAnalyzer.generating') || 'Generating...'}
                </Badge>
              )}
            </HStack>

            <Box
              bg={elevatedBg}
              borderRadius="24px"
              border="1px solid"
              borderColor={borderColor}
              p={{ base: 6, md: 10 }}
              boxShadow="lg"
              className="markdown-body"
              position="relative"
              overflow="hidden"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: ({ children }) => <Heading as="h1" size="lg" mb={4} mt={6} fontFamily="var(--font-headline)" borderBottom="2px solid" borderColor={accentSoft} pb={2}>{children}</Heading>,
                  h2: ({ children }) => <Heading as="h2" size="md" mb={3} mt={6} fontFamily="var(--font-headline)" color={accent}>{children}</Heading>,
                  h3: ({ children }) => <Heading as="h3" size="sm" mb={2} mt={4} fontFamily="var(--font-headline)">{children}</Heading>,
                  p: ({ children }) => <Text mb={4} lineHeight="1.7" color="label.primary" fontFamily="var(--font-body)">{children}</Text>,
                  ul: ({ children }) => <Box as="ul" mb={4} pl={5}>{children}</Box>,
                  li: ({ children }) => <Box as="li" mb={2} lineHeight="1.6" color="label.primary" fontFamily="var(--font-body)">{children}</Box>,
                  code({ inline, className, children, ...props }) {
                    return inline ? (
                      <code
                        style={{
                          background: accentSoft,
                          color: accent,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85em',
                          fontWeight: '600',
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <Box
                        as="pre"
                        p={4}
                        borderRadius="12px"
                        bg={useColorModeValue('gray.50', 'rgba(255,255,255,0.03)')}
                        border="1px solid"
                        borderColor={borderColor}
                        mb={4}
                        overflowX="auto"
                      >
                        <code className={className} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9em' }} {...props}>
                          {children}
                        </code>
                      </Box>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: accent, fontWeight: '600', textDecoration: 'underline' }}>
                        {children}
                      </a>
                    );
                  },
                  blockquote: ({ children }) => (
                    <Box
                      pl={4}
                      py={1}
                      borderLeft="4px solid"
                      borderColor={accent}
                      bg={accentSoft}
                      borderRadius="r-md"
                      mb={4}
                      fontStyle="italic"
                    >
                      {children}
                    </Box>
                  ),
                }}
              >
                {result || ''}
              </ReactMarkdown>

              {isStreaming && (
                <Box display="inline-block" ml={1} verticalAlign="middle">
                  <Box
                    w="2px"
                    h="18px"
                    bg={accent}
                    animation="cursor-blink 1s step-end infinite"
                  />
                </Box>
              )}

              {/* Decorative elements */}
              <Box
                position="absolute"
                top={0}
                right={0}
                w="150px"
                h="150px"
                bgGradient={`radial(${accentSoft}, transparent 70%)`}
                opacity={0.5}
                pointerEvents="none"
              />
            </Box>

            <Flex align="center" justify="center" gap={4} py={4}>
              <Icon as={FaLightbulb} color="orange.400" />
              <Text fontSize="xs" color={textSecondary} fontFamily="var(--font-body)">
                {t('jdAnalyzer.proTip') || 'Pro-tip: Relevant projects mentioned in the report will be highlighted in the portfolio.'}
              </Text>
            </Flex>
          </VStack>
        )}
      </VStack>

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </Box>
  );
}

export default JDAnalyzer;
