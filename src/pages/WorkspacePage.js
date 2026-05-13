import React, { useState, useCallback } from 'react';
import {
  Box, VStack, HStack, Heading, Text, Textarea, Button, Badge,
  Icon, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Progress,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaSearch, FaFileAlt, FaArchive, FaStop, FaDownload, FaRedo, FaHeartbeat, FaClipboardCheck } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PinGate from '../components/PinGate';
import useJDMatch from '../hooks/useJDMatch';
import useJobApply from '../hooks/useJobApply';
import useHealthCheck from '../hooks/useHealthCheck';
import useUsage from '../hooks/useUsage';
import JSZip from 'jszip';

const MAX_CHARS = 5000;

function downloadBlob(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function WizardStep({ number, title, icon, isActive, isDone }) {
  const accent = useColorModeValue('#007AFF', '#0A84FF');
  const accentSoft = useColorModeValue('rgba(0,122,255,0.1)', 'rgba(10,132,255,0.15)');
  const border = useColorModeValue('rgba(60,60,67,0.12)', 'rgba(84,84,88,0.4)');
  return (
    <HStack
      spacing={3}
      px={4} py={2}
      borderRadius="full"
      bg={isActive ? accentSoft : 'transparent'}
      border="1px solid"
      borderColor={isActive ? accent : border}
      opacity={!isActive && !isDone ? 0.45 : 1}
      transition="all 0.2s"
    >
      <Icon as={icon} color={isActive || isDone ? accent : 'label.secondary'} boxSize={3.5} />
      <Text
        fontSize="xs"
        fontFamily="var(--font-headline)"
        fontWeight={700}
        color={isActive || isDone ? accent : 'label.secondary'}
        letterSpacing="-0.01em"
      >
        {number}. {title}
      </Text>
      {isDone && <Badge colorScheme="green" variant="subtle" borderRadius="full" fontSize="2xs">Done</Badge>}
    </HStack>
  );
}

const SCORE_KEYS = ['impact', 'technical_depth', 'readability', 'ownership', 'career_progression',
  'ats_compatibility', 'job_relevance', 'differentiation'];

const DIMENSION_LABELS = {
  impact: '量化成果',
  technical_depth: '技術深度',
  readability: '履歷易讀性',
  ownership: '主導力',
  career_progression: '職涯成長軌跡',
  ats_compatibility: 'ATS 相容性',
  job_relevance: '職缺契合度',
  differentiation: '差異化亮點',
};

function calcOverall(scores) {
  const keys = SCORE_KEYS.filter((k) => scores[k]?.score !== undefined);
  if (!keys.length) return 0;
  const avg = keys.reduce((sum, k) => sum + scores[k].score, 0) / keys.length;
  return Math.round(avg * 10);
}

function HealthCheckContent({ usage }) {
  const accent     = useColorModeValue('#007AFF', '#0A84FF');
  const accentSoft = useColorModeValue('rgba(0,122,255,0.08)', 'rgba(10,132,255,0.15)');
  const border     = useColorModeValue('rgba(60,60,67,0.12)', 'rgba(84,84,88,0.4)');
  const cardBg     = useColorModeValue('rgba(255,255,255,0.85)', 'rgba(28,28,30,0.85)');
  const textSub    = useColorModeValue('rgba(60,60,67,0.6)', 'rgba(235,235,245,0.6)');

  const [mode, setMode] = useState(null);
  const [jdText, setJdText] = useState('');
  const { scores, isLoadingScores, suggestions, isStreamingSuggestions, error, check, stop, reset, remaining: hcRemaining } = useHealthCheck();
  const remaining = hcRemaining ?? usage?.healthCheck?.remaining ?? null;
  const exhausted = remaining !== null && remaining <= 0;

  const isOverLimit = jdText.length > 5000;
  const canStart = mode === 'base' || (mode === 'jd' && jdText.trim() && !isOverLimit);

  const handleReset = useCallback(() => { setMode(null); setJdText(''); reset(); }, [reset]);

  const overall = scores ? calcOverall(scores) : null;
  const overallColor = overall >= 70 ? 'green.400' : overall >= 50 ? 'yellow.400' : 'red.400';

  return (
    <VStack align="stretch" spacing={5}>
      {/* Mode selection */}
      {!scores && !isLoadingScores && (
        <HStack spacing={4} justify="center" wrap="wrap">
          {[
            { id: 'base', label: '快速健檢', sub: '5 維度 · 無需 JD', icon: FaClipboardCheck },
            { id: 'jd',   label: 'JD 比對',   sub: '10 維度 · 需貼職缺', icon: FaSearch },
          ].map(({ id, label, sub, icon }) => (
            <Box key={id} as="button" onClick={() => setMode(id)}
              bg={mode === id ? accentSoft : cardBg}
              border="2px solid" borderColor={mode === id ? accent : border}
              borderRadius="20px" p={5} minW="160px" textAlign="center"
              transition="all 0.2s" _hover={{ borderColor: accent }}
              backdropFilter="blur(20px)">
              <Icon as={icon} color={mode === id ? accent : 'label.secondary'} boxSize={5} mb={2} />
              <Text fontWeight="700" fontSize="sm" fontFamily="var(--font-headline)"
                color={mode === id ? accent : 'label.primary'}>{label}</Text>
              <Text fontSize="xs" color={textSub} fontFamily="var(--font-body)">{sub}</Text>
            </Box>
          ))}
        </HStack>
      )}

      {/* JD Textarea (Mode B) */}
      {mode === 'jd' && !scores && !isLoadingScores && (
        <Box position="relative">
          <Textarea
            value={jdText} onChange={(e) => setJdText(e.target.value)}
            placeholder="貼上職缺描述（Job Description）..." minH="160px" maxH="320px"
            borderRadius="16px" fontSize="sm" fontFamily="var(--font-body)"
            borderColor={isOverLimit ? 'red.400' : border} p={4}
            bg={useColorModeValue('rgba(0,0,0,0.02)', 'rgba(255,255,255,0.02)')}
            _focus={{ borderColor: accent, boxShadow: `0 0 0 2px ${accentSoft}` }}
          />
          <Flex position="absolute" bottom={3} right={3} align="center"
            bg={useColorModeValue('white', 'gray.800')} px={2} py={0.5}
            borderRadius="full" border="1px solid" borderColor={border}>
            <Text fontSize="2xs" fontWeight="700" fontFamily="var(--font-mono)"
              color={isOverLimit ? 'red.400' : textSub}>
              {jdText.length.toLocaleString()} / 5,000
            </Text>
          </Flex>
        </Box>
      )}

      {/* Action buttons */}
      {!scores && (
        <Flex justify="center" gap={3}>
          {isLoadingScores ? (
            <HStack spacing={3}>
              <Spinner size="sm" color={accent} />
              <Text fontSize="sm" color={textSub} fontFamily="var(--font-body)">分析中，請稍候…</Text>
              <Button onClick={stop} leftIcon={<FaStop />} size="sm" variant="outline"
                borderColor="red.400" color="red.400" borderRadius="full"
                fontFamily="var(--font-headline)" fontWeight={700}>Stop</Button>
            </HStack>
          ) : (
            <VStack spacing={1}>
              <Button onClick={() => check(mode, jdText)} isDisabled={!canStart || exhausted}
                leftIcon={<FaHeartbeat />} className={exhausted ? '' : 'accent-gradient'}
                style={exhausted ? {} : { color: '#FFFFFF' }} border="none" borderRadius="full"
                fontFamily="var(--font-headline)" fontWeight={700} px={10}
                _hover={exhausted ? {} : { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,122,255,0.35)' }}
                transition="all 0.2s">
                開始健檢
              </Button>
              {remaining !== null && (
                <Text fontSize="xs" color={exhausted ? 'orange.400' : textSub} fontFamily="var(--font-label)">
                  {exhausted ? '今日次數已用完，明天再試' : `今日剩餘 ${remaining} 次`}
                </Text>
              )}
            </VStack>
          )}
        </Flex>
      )}

      {error && (
        <Text color="red.400" fontSize="sm" textAlign="center" fontFamily="var(--font-body)">{error}</Text>
      )}

      {/* Score panel */}
      {scores && (
        <Box bg={cardBg} backdropFilter="blur(20px)" borderRadius="24px"
          border="1px solid" borderColor={border} p={{ base: 5, md: 8 }} boxShadow="lg">
          <VStack align="stretch" spacing={6}>

            {/* Overall score */}
            <VStack spacing={1} textAlign="center">
              <Text fontSize="xs" fontFamily="var(--font-label)" textTransform="uppercase"
                letterSpacing="widest" color={textSub}>Overall Score</Text>
              <Text fontSize="5xl" fontWeight="800" fontFamily="var(--font-headline)"
                color={overallColor} lineHeight="1">{overall}</Text>
              <Text fontSize="xs" color={textSub} fontFamily="var(--font-body)">/100</Text>
            </VStack>

            {/* Dimension bars */}
            <VStack align="stretch" spacing={4}>
              {SCORE_KEYS.filter((k) => scores[k]?.score !== undefined).map((key) => {
                const { score, reason } = scores[key];
                const colorScheme = score < 6 ? 'red' : score < 8 ? 'yellow' : 'green';
                return (
                  <Box key={key}>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm" fontWeight="600" fontFamily="var(--font-headline)"
                        color="label.primary">{DIMENSION_LABELS[key] || key}</Text>
                      <Text fontSize="sm" fontWeight="700" fontFamily="var(--font-mono)"
                        color={score < 6 ? 'red.400' : score < 8 ? 'yellow.400' : 'green.400'}>
                        {score}/10
                      </Text>
                    </Flex>
                    <Progress value={score * 10} colorScheme={colorScheme}
                      borderRadius="full" size="sm" mb={1} />
                    <Text fontSize="xs" color={textSub} fontFamily="var(--font-body)">{reason}</Text>
                  </Box>
                );
              })}
            </VStack>

            {/* Missing keywords (Mode B) */}
            {scores.missing_keywords?.length > 0 && (
              <Box>
                <Text fontSize="xs" fontFamily="var(--font-label)" textTransform="uppercase"
                  letterSpacing="widest" color={textSub} mb={2}>缺少的關鍵字</Text>
                <Flex wrap="wrap" gap={2}>
                  {scores.missing_keywords.map((kw) => (
                    <Badge key={kw} px={2} py={1} borderRadius="full"
                      colorScheme="orange" variant="subtle" fontSize="xs"
                      fontFamily="var(--font-mono)">{kw}</Badge>
                  ))}
                </Flex>
              </Box>
            )}

            {/* Hiring recommendation (Mode B) */}
            {scores.hiring_recommendation && (
              <HStack spacing={2}>
                <Text fontSize="xs" fontFamily="var(--font-label)" textTransform="uppercase"
                  letterSpacing="widest" color={textSub}>錄取建議：</Text>
                <Badge px={3} py={1} borderRadius="full" fontSize="sm" fontWeight="700"
                  colorScheme={
                    scores.hiring_recommendation === 'Strong Yes' ? 'green' :
                    scores.hiring_recommendation === 'Yes' ? 'blue' :
                    scores.hiring_recommendation === 'Maybe' ? 'yellow' : 'red'
                  }>
                  {scores.hiring_recommendation}
                </Badge>
              </HStack>
            )}

            <Flex justify="flex-end">
              <Button onClick={handleReset} leftIcon={<FaRedo />} size="sm" variant="outline"
                borderColor={border} borderRadius="full" fontFamily="var(--font-headline)"
                fontWeight={700} color="label.secondary" _hover={{ borderColor: accent, color: accent }}>
                重新健檢
              </Button>
            </Flex>
          </VStack>
        </Box>
      )}

      {/* Streaming suggestions */}
      {(suggestions || isStreamingSuggestions) && (
        <Box bg={cardBg} backdropFilter="blur(20px)" borderRadius="24px"
          border="1px solid" borderColor={border} p={{ base: 5, md: 8 }} boxShadow="lg">
          <HStack spacing={2} color={accent} mb={4}>
            <Icon as={FaClipboardCheck} />
            <Text fontWeight="700" fontSize="sm" fontFamily="var(--font-headline)">優化建議</Text>
            {isStreamingSuggestions && (
              <Button onClick={stop} leftIcon={<FaStop />} size="xs" variant="outline"
                borderColor="red.400" color="red.400" borderRadius="full"
                fontFamily="var(--font-headline)" fontWeight={700}>Stop</Button>
            )}
          </HStack>
          <Box className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{suggestions}</ReactMarkdown>
            {isStreamingSuggestions && (
              <Box display="inline-block" ml={1}>
                <Box w="2px" h="16px" bg={accent} animation="cursor-blink 1s step-end infinite" />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </VStack>
  );
}

function WorkspaceContent() {
  const accent       = useColorModeValue('#007AFF', '#0A84FF');
  const accentSoft   = useColorModeValue('rgba(0,122,255,0.08)', 'rgba(10,132,255,0.15)');
  const border       = useColorModeValue('rgba(60,60,67,0.12)', 'rgba(84,84,88,0.4)');
  const cardBg       = useColorModeValue('rgba(255,255,255,0.85)', 'rgba(28,28,30,0.85)');
  const textSub      = useColorModeValue('rgba(60,60,67,0.6)', 'rgba(235,235,245,0.6)');

  // Wizard state
  const [activeStep, setActiveStep] = useState(0); // 0=JD Match, 1=Job Apply, 2=Release
  const [jdText, setJdText] = useState('');

  const { result: matchResult, isStreaming: isMatching, error: matchError, match, stop: stopMatch, reset: resetMatch, remaining: matchRemaining } = useJDMatch();
  const { resumeText, coverText, isStreaming: isApplying, error: applyError, apply, stop: stopApply, reset: resetApply, remaining: applyRemaining } = useJobApply();
  const { usage } = useUsage();
  const matchLeft = matchRemaining ?? usage?.matchJD?.remaining ?? null;
  const applyLeft = applyRemaining ?? usage?.applyJob?.remaining ?? null;
  const matchExhausted = matchLeft !== null && matchLeft <= 0;
  const applyExhausted = applyLeft !== null && applyLeft <= 0;

  const charsLeft = MAX_CHARS - jdText.length;
  const isOverLimit = jdText.length > MAX_CHARS;

  const handleReset = useCallback(() => {
    setActiveStep(0);
    setJdText('');
    resetMatch();
    resetApply();
  }, [resetMatch, resetApply]);

  const handleDownloadZip = useCallback(async () => {
    const zip = new JSZip();
    zip.file('jd-match.md', matchResult || '');
    zip.file('resume.md', resumeText || '');
    zip.file('cover-letter.md', coverText || '');
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'application-package.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [matchResult, resumeText, coverText]);

  return (
    <Box maxW="960px" mx="auto" px={{ base: 4, md: 8 }} pt="120px" pb={24}>
      <VStack align="stretch" spacing={8}>

        {/* Header */}
        <VStack align="center" spacing={3} textAlign="center">
          <Badge px={3} py={1} borderRadius="full" bg={accentSoft} color={accent}
            fontFamily="var(--font-label)" fontSize="2xs" letterSpacing="widest" textTransform="uppercase">
            Private Workspace
          </Badge>
          <Heading fontFamily="var(--font-headline)" fontWeight="800"
            fontSize={{ base: '2xl', md: '4xl' }} letterSpacing="-0.03em" color="label.primary">
            AI 求職工具箱
          </Heading>
          <Text color="label.secondary" fontSize="sm" fontFamily="var(--font-body)">
            履歷健檢 · JD 比對分析 · 客製化履歷生成
          </Text>
        </VStack>

        {/* Top-level tabs */}
        <Tabs variant="soft-rounded" colorScheme="blue" isLazy>
          <TabList justifyContent="center" gap={2}>
            <Tab fontFamily="var(--font-headline)" fontWeight={700} borderRadius="full"
              leftIcon={<FaFileAlt />}>
              <Icon as={FaFileAlt} mr={2} boxSize={3.5} />Job Wizard
            </Tab>
            <Tab fontFamily="var(--font-headline)" fontWeight={700} borderRadius="full">
              <Icon as={FaHeartbeat} mr={2} boxSize={3.5} />Resume Health Check
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0} pt={6}>
              <VStack align="stretch" spacing={8}>

        {/* Step indicator */}
        <Flex justify="center" wrap="wrap" gap={2}>
          <WizardStep number={1} title="JD Match" icon={FaSearch}
            isActive={activeStep === 0} isDone={activeStep > 0 && !!matchResult} />
          <WizardStep number={2} title="Job Apply" icon={FaFileAlt}
            isActive={activeStep === 1} isDone={activeStep > 1 && !!resumeText} />
          <WizardStep number={3} title="Release" icon={FaArchive}
            isActive={activeStep === 2} isDone={false} />
        </Flex>

        {/* ── STEP 1: JD Match ── */}
        {activeStep === 0 && (
          <Box bg={cardBg} backdropFilter="blur(20px)" borderRadius="24px"
            border="1px solid" borderColor={border} p={{ base: 5, md: 8 }} boxShadow="lg">
            <VStack align="stretch" spacing={5}>
              <HStack spacing={2} color={accent}>
                <Icon as={FaSearch} />
                <Text fontWeight="700" fontSize="sm" fontFamily="var(--font-headline)">Step 1 — JD Match</Text>
              </HStack>

              <Box position="relative">
                <Textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here..."
                  minH="220px" maxH="400px" borderRadius="16px" fontSize="sm"
                  fontFamily="var(--font-body)" borderColor={border} p={4}
                  bg={useColorModeValue('rgba(0,0,0,0.02)', 'rgba(255,255,255,0.02)')}
                  _focus={{ borderColor: accent, boxShadow: `0 0 0 2px ${accentSoft}` }}
                  isDisabled={isMatching}
                />
                <Flex position="absolute" bottom={3} right={3} align="center"
                  bg={useColorModeValue('white', 'gray.800')} px={2} py={0.5}
                  borderRadius="full" border="1px solid" borderColor={border}>
                  <Text fontSize="2xs" fontWeight="700" fontFamily="var(--font-mono)"
                    color={isOverLimit ? 'red.400' : textSub}>
                    {jdText.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                  </Text>
                </Flex>
              </Box>

              <Flex justify="center" direction="column" align="center" gap={1}>
                {isMatching ? (
                  <Button onClick={stopMatch} leftIcon={<FaStop />} variant="outline"
                    borderColor="red.400" color="red.400" borderRadius="full"
                    fontFamily="var(--font-headline)" fontWeight={700}>
                    Stop
                  </Button>
                ) : (
                  <Button onClick={() => match(jdText)} isDisabled={!jdText.trim() || isOverLimit || matchExhausted}
                    leftIcon={<FaSearch />} className={matchExhausted ? '' : 'accent-gradient'}
                    style={matchExhausted ? {} : { color: '#FFFFFF' }} border="none" borderRadius="full"
                    fontFamily="var(--font-headline)" fontWeight={700} px={10}
                    _hover={matchExhausted ? {} : { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,122,255,0.35)' }}
                    transition="all 0.2s">
                    Analyse Fit
                  </Button>
                )}
                {matchLeft !== null && !isMatching && (
                  <Text fontSize="xs" color={matchExhausted ? 'orange.400' : textSub} fontFamily="var(--font-label)">
                    {matchExhausted ? '今日次數已用完，明天再試' : `今日剩餘 ${matchLeft} 次`}
                  </Text>
                )}
              </Flex>

              {matchError && (
                <Text color="red.400" fontSize="sm" textAlign="center" fontFamily="var(--font-body)">
                  {matchError}
                </Text>
              )}

              {(matchResult || isMatching) && (
                <Box bg={useColorModeValue('#FFFFFF', '#1C1C1E')} borderRadius="16px"
                  border="1px solid" borderColor={border} p={6} className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{matchResult || ''}</ReactMarkdown>
                  {isMatching && (
                    <Box display="inline-block" ml={1}>
                      <Box w="2px" h="16px" bg={accent} animation="cursor-blink 1s step-end infinite" />
                    </Box>
                  )}
                </Box>
              )}

              {matchResult && !isMatching && (
                <Flex justify="flex-end">
                  <Button onClick={() => setActiveStep(1)} rightIcon={<FaFileAlt />}
                    className="accent-gradient" style={{ color: '#FFFFFF' }} border="none"
                    borderRadius="full" fontFamily="var(--font-headline)" fontWeight={700}
                    _hover={{ transform: 'translateY(-1px)' }} transition="all 0.2s">
                    Continue to Job Apply →
                  </Button>
                </Flex>
              )}
            </VStack>
          </Box>
        )}

        {/* ── STEP 2: Job Apply ── */}
        {activeStep === 1 && (
          <Box bg={cardBg} backdropFilter="blur(20px)" borderRadius="24px"
            border="1px solid" borderColor={border} p={{ base: 5, md: 8 }} boxShadow="lg">
            <VStack align="stretch" spacing={5}>
              <HStack spacing={2} color={accent}>
                <Icon as={FaFileAlt} />
                <Text fontWeight="700" fontSize="sm" fontFamily="var(--font-headline)">Step 2 — Generate Resume & Cover Letter</Text>
              </HStack>

              <Box bg={useColorModeValue('rgba(0,0,0,0.03)', 'rgba(255,255,255,0.03)')}
                borderRadius="12px" p={4} border="1px solid" borderColor={border}>
                <Text fontSize="xs" color={textSub} fontFamily="var(--font-label)"
                  textTransform="uppercase" letterSpacing="widest" mb={2}>JD (from Step 1)</Text>
                <Text fontSize="sm" fontFamily="var(--font-body)" color="label.secondary"
                  noOfLines={3}>{jdText}</Text>
              </Box>

              {!resumeText && !coverText && !isApplying && (
                <Text fontSize="sm" color={textSub} textAlign="center" fontFamily="var(--font-body)">
                  點擊下方按鈕，AI 將根據職缺描述與第一步的分析結果，同時生成<strong>客製化履歷</strong>與<strong>求職信（Cover Letter）</strong>，完成後可分別下載或打包 ZIP。
                </Text>
              )}

              <Flex justify="center" direction="column" align="center" gap={1}>
                {isApplying ? (
                  <Button onClick={stopApply} leftIcon={<FaStop />} variant="outline"
                    borderColor="red.400" color="red.400" borderRadius="full"
                    fontFamily="var(--font-headline)" fontWeight={700}>
                    Stop
                  </Button>
                ) : (
                  <Button onClick={() => apply(jdText, matchResult)} isDisabled={isApplying || applyExhausted}
                    leftIcon={<FaFileAlt />} className={applyExhausted ? '' : 'accent-gradient'}
                    style={applyExhausted ? {} : { color: '#FFFFFF' }} border="none" borderRadius="full"
                    fontFamily="var(--font-headline)" fontWeight={700} px={10}
                    _hover={applyExhausted ? {} : { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,122,255,0.35)' }}
                    transition="all 0.2s">
                    {resumeText || coverText ? 'Regenerate' : 'Generate Resume & Cover Letter'}
                  </Button>
                )}
                {applyLeft !== null && !isApplying && (
                  <Text fontSize="xs" color={applyExhausted ? 'orange.400' : textSub} fontFamily="var(--font-label)">
                    {applyExhausted ? '今日次數已用完，明天再試' : `今日剩餘 ${applyLeft} 次`}
                  </Text>
                )}
              </Flex>

              {applyError && (
                <Text color="red.400" fontSize="sm" textAlign="center" fontFamily="var(--font-body)">
                  {applyError}
                </Text>
              )}

              {(resumeText || coverText || isApplying) && (
                <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
                  <TabList>
                    <Tab fontFamily="var(--font-headline)" fontWeight={600}>
                      Resume
                      {resumeText && !isApplying && <Badge ml={2} colorScheme="green" variant="subtle" borderRadius="full" fontSize="2xs">Done</Badge>}
                    </Tab>
                    <Tab fontFamily="var(--font-headline)" fontWeight={600}>
                      Cover Letter
                      {isApplying && resumeText && !coverText && <Badge ml={2} colorScheme="blue" variant="subtle" borderRadius="full" fontSize="2xs">生成中…</Badge>}
                      {coverText && !isApplying && <Badge ml={2} colorScheme="green" variant="subtle" borderRadius="full" fontSize="2xs">Done</Badge>}
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel px={0}>
                      <Box bg={useColorModeValue('#FFFFFF', '#1C1C1E')} borderRadius="16px"
                        border="1px solid" borderColor={border} p={6} className="markdown-body" minH="200px">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{resumeText || ''}</ReactMarkdown>
                        {isApplying && !coverText && (
                          <Box display="inline-block" ml={1}>
                            <Box w="2px" h="16px" bg={accent} animation="cursor-blink 1s step-end infinite" />
                          </Box>
                        )}
                      </Box>
                      {resumeText && (
                        <Flex justify="flex-end" mt={3}>
                          <Button size="sm" leftIcon={<FaDownload />} variant="outline"
                            borderColor={accent} color={accent} borderRadius="full"
                            fontFamily="var(--font-headline)" fontWeight={600}
                            onClick={() => downloadBlob(resumeText, 'resume.md')}>
                            Download Resume .md
                          </Button>
                        </Flex>
                      )}
                    </TabPanel>
                    <TabPanel px={0}>
                      {isApplying && !coverText ? (
                        <Box bg={useColorModeValue('#FFFFFF', '#1C1C1E')} borderRadius="16px"
                          border="1px solid" borderColor={border} p={6} minH="200px"
                          display="flex" alignItems="center" justifyContent="center">
                          <VStack spacing={3}>
                            <Box w="2px" h="20px" bg={accent} animation="cursor-blink 1s step-end infinite" />
                            <Text fontSize="sm" color={textSub} fontFamily="var(--font-body)">
                              Resume 生成完畢，正在生成 Cover Letter…
                            </Text>
                          </VStack>
                        </Box>
                      ) : (
                        <Box bg={useColorModeValue('#FFFFFF', '#1C1C1E')} borderRadius="16px"
                          border="1px solid" borderColor={border} p={6} className="markdown-body" minH="200px">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{coverText || ''}</ReactMarkdown>
                          {isApplying && coverText && (
                            <Box display="inline-block" ml={1}>
                              <Box w="2px" h="16px" bg={accent} animation="cursor-blink 1s step-end infinite" />
                            </Box>
                          )}
                        </Box>
                      )}
                      {coverText && (
                        <Flex justify="flex-end" mt={3}>
                          <Button size="sm" leftIcon={<FaDownload />} variant="outline"
                            borderColor={accent} color={accent} borderRadius="full"
                            fontFamily="var(--font-headline)" fontWeight={600}
                            onClick={() => downloadBlob(coverText, 'cover-letter.md')}>
                            Download Cover Letter .md
                          </Button>
                        </Flex>
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              )}

              {(resumeText || coverText) && (
                <Flex justify="space-between" align="center" pt={2} borderTop="1px solid" borderColor={border}>
                  <Text fontSize="xs" color={textSub} fontFamily="var(--font-body)">
                    {!coverText || isApplying
                      ? 'Cover Letter 生成完成後即可前往下一步'
                      : '履歷與求職信皆已生成，可前往打包下載'}
                  </Text>
                  <Button onClick={() => setActiveStep(2)} rightIcon={<FaArchive />}
                    isDisabled={!resumeText || !coverText || isApplying}
                    className={resumeText && coverText && !isApplying ? 'accent-gradient' : ''}
                    style={resumeText && coverText && !isApplying ? { color: '#FFFFFF' } : {}}
                    border="none" borderRadius="full" fontFamily="var(--font-headline)" fontWeight={700}
                    _hover={resumeText && coverText && !isApplying ? { transform: 'translateY(-1px)' } : {}}
                    transition="all 0.2s">
                    前往 Step 3 打包下載 →
                  </Button>
                </Flex>
              )}
            </VStack>
          </Box>
        )}

        {/* ── STEP 3: Release ── */}
        {activeStep === 2 && (
          <Box bg={cardBg} backdropFilter="blur(20px)" borderRadius="24px"
            border="1px solid" borderColor={border} p={{ base: 5, md: 8 }} boxShadow="lg">
            <VStack align="stretch" spacing={6}>
              <HStack spacing={2} color={accent}>
                <Icon as={FaArchive} />
                <Text fontWeight="700" fontSize="sm" fontFamily="var(--font-headline)">Step 3 — Release Package</Text>
              </HStack>

              <VStack align="stretch" spacing={3}>
                {[
                  { name: 'jd-match.md', size: matchResult?.length || 0, label: 'JD Match Analysis' },
                  { name: 'resume.md', size: resumeText?.length || 0, label: 'Customised Resume' },
                  { name: 'cover-letter.md', size: coverText?.length || 0, label: 'Cover Letter' },
                ].map((file) => (
                  <HStack key={file.name} p={3} borderRadius="12px"
                    bg={useColorModeValue('rgba(0,0,0,0.03)', 'rgba(255,255,255,0.03)')}
                    border="1px solid" borderColor={border} justify="space-between">
                    <HStack spacing={3}>
                      <Icon as={FaFileAlt} color={accent} boxSize={3.5} />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontFamily="var(--font-mono)" fontWeight={600}>{file.name}</Text>
                        <Text fontSize="xs" color={textSub} fontFamily="var(--font-body)">{file.label}</Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="xs" color={textSub} fontFamily="var(--font-mono)">
                      {(file.size / 1000).toFixed(1)} KB
                    </Text>
                  </HStack>
                ))}
              </VStack>

              <Flex justify="center" gap={4} wrap="wrap">
                <Button onClick={handleDownloadZip} leftIcon={<FaDownload />}
                  className="accent-gradient" style={{ color: '#FFFFFF' }} border="none"
                  borderRadius="full" fontFamily="var(--font-headline)" fontWeight={700} px={10}
                  _hover={{ transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,122,255,0.35)' }}
                  transition="all 0.2s">
                  Download ZIP
                </Button>
                <Button onClick={handleReset} leftIcon={<FaRedo />} variant="outline"
                  borderColor={border} borderRadius="full" fontFamily="var(--font-headline)"
                  fontWeight={700} color="label.secondary"
                  _hover={{ borderColor: accent, color: accent }}>
                  Start Over
                </Button>
              </Flex>
            </VStack>
          </Box>
        )}

              </VStack>
            </TabPanel>

            {/* Resume Health Check tab */}
            <TabPanel px={0} pt={6}>
              <HealthCheckContent usage={usage} />
            </TabPanel>
          </TabPanels>
        </Tabs>

      </VStack>

      <style>{`
        @keyframes cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .markdown-body h1, .markdown-body h2, .markdown-body h3 { margin: 1em 0 0.5em; font-weight: 700; }
        .markdown-body h2 { color: #0A84FF; }
        .markdown-body p { margin-bottom: 0.75em; line-height: 1.7; }
        .markdown-body ul { padding-left: 1.5em; margin-bottom: 0.75em; }
        .markdown-body li { margin-bottom: 0.3em; }
        .markdown-body strong { font-weight: 700; }
      `}</style>
    </Box>
  );
}

function WorkspacePage() {
  return (
    <PinGate>
      <WorkspaceContent />
    </PinGate>
  );
}

export default WorkspacePage;
