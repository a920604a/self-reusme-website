import React from 'react';
import {
  Box, VStack, Heading, Text, Button, Badge, HStack, Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaRobot, FaArrowRight, FaMagic } from 'react-icons/fa';
import { useLocaleContext } from '../context/LocaleContext';

function AILabPage() {
  const { t } = useLocaleContext();
  const accent     = useColorModeValue('#007AFF', '#0A84FF');
  const accentSoft = useColorModeValue('rgba(0,122,255,0.08)', 'rgba(10,132,255,0.15)');
  const border     = useColorModeValue('rgba(60,60,67,0.12)', 'rgba(84,84,88,0.4)');
  const cardBg     = useColorModeValue('rgba(255,255,255,0.8)', 'rgba(28,28,30,0.8)');
  const textSub    = useColorModeValue('rgba(60,60,67,0.6)', 'rgba(235,235,245,0.6)');

  return (
    <Box maxW="900px" mx="auto" px={{ base: 4, md: 8 }} pt="120px" pb={24}>
      <VStack align="stretch" spacing={12}>

        {/* Header */}
        <VStack align="center" spacing={4} textAlign="center">
          <Badge
            px={3} py={1} borderRadius="full"
            bg={accentSoft} color={accent}
            fontFamily="var(--font-label)" fontSize="2xs"
            letterSpacing="widest" textTransform="uppercase"
          >
            AI-Powered Tools
          </Badge>
          <Heading
            fontFamily="var(--font-headline)"
            fontWeight="800"
            fontSize={{ base: '3xl', md: '5xl' }}
            letterSpacing="-0.03em"
            color="label.primary"
          >
            {t('aiLab.title') || 'AI Lab'}
          </Heading>
          <Text
            color="label.secondary"
            fontSize={{ base: 'md', md: 'lg' }}
            maxW="560px"
            fontFamily="var(--font-body)"
            lineHeight="tall"
          >
            {t('aiLab.subtitle') || 'AI-powered tools built into this portfolio. Explore how my experience matches your needs.'}
          </Text>
        </VStack>

        {/* JD Analyzer Card */}
        <Box
          bg={cardBg}
          backdropFilter="blur(20px)"
          borderRadius="24px"
          border="1px solid"
          borderColor={border}
          p={{ base: 6, md: 10 }}
          boxShadow="lg"
          transition="all 0.3s ease"
          _hover={{ boxShadow: '2xl', borderColor: accent, transform: 'translateY(-2px)' }}
        >
          <VStack align="stretch" spacing={5}>
            <HStack spacing={3}>
              <Box
                p={3} borderRadius="16px"
                bg={accentSoft} color={accent}
              >
                <Icon as={FaMagic} boxSize={5} />
              </Box>
              <VStack align="start" spacing={0}>
                <Heading
                  fontFamily="var(--font-headline)"
                  fontWeight="700"
                  fontSize="xl"
                  letterSpacing="-0.02em"
                >
                  JD Analyzer
                </Heading>
                <Text fontSize="sm" color={textSub} fontFamily="var(--font-body)">
                  RAG-powered · For recruiters & hiring managers
                </Text>
              </VStack>
            </HStack>

            <Text color="label.secondary" fontFamily="var(--font-body)" lineHeight="tall">
              {t('aiLab.jdAnalyzerDesc') || 'Paste a job description to instantly analyze how my experience, projects, and skills align with your requirements. Powered by Retrieval-Augmented Generation.'}
            </Text>

            <Box>
              <Button
                as={RouterLink}
                to="/jd-analyzer"
                rightIcon={<FaArrowRight />}
                leftIcon={<FaRobot />}
                className="accent-gradient"
                style={{ color: '#FFFFFF' }}
                border="none"
                borderRadius="full"
                fontFamily="var(--font-headline)"
                fontWeight={700}
                px={8}
                _hover={{ transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,122,255,0.35)' }}
                transition="all 0.2s"
              >
                {t('aiLab.openJDAnalyzer') || 'Open JD Analyzer'}
              </Button>
            </Box>
          </VStack>
        </Box>

      </VStack>
    </Box>
  );
}

export default AILabPage;
