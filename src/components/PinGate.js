import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Input, Button, FormControl,
  useColorModeValue,
} from '@chakra-ui/react';

const CORRECT_PIN = process.env.REACT_APP_WORKSPACE_PIN || '0000';
const SESSION_KEY = 'ws_unlocked';

function PinGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setUnlocked(true);
    } else {
      setError(true);
      setPin('');
    }
  };

  const cardBg    = useColorModeValue('rgba(255,255,255,0.8)', 'rgba(28,28,30,0.8)');
  const border    = useColorModeValue('rgba(60,60,67,0.12)', 'rgba(84,84,88,0.4)');
  const accent    = useColorModeValue('#007AFF', '#0A84FF');
  const textSub   = useColorModeValue('rgba(60,60,67,0.6)', 'rgba(235,235,245,0.6)');

  if (unlocked) return children;

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg={cardBg}
        backdropFilter="blur(20px)"
        border="1px solid"
        borderColor={border}
        borderRadius="24px"
        p={{ base: 8, md: 12 }}
        w="full"
        maxW="400px"
        boxShadow="xl"
      >
        <VStack spacing={6} align="stretch">
          <VStack spacing={2} align="center">
            <Heading
              fontFamily="var(--font-headline)"
              fontWeight="800"
              fontSize="2xl"
              letterSpacing="-0.03em"
              color={accent}
            >
              Developer Mode
            </Heading>
            <Text fontSize="sm" color={textSub} fontFamily="var(--font-body)" textAlign="center">
              Enter PIN to access the workspace
            </Text>
          </VStack>

          <FormControl isInvalid={error}>
            <Input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              placeholder="PIN"
              textAlign="center"
              fontSize="xl"
              letterSpacing="0.3em"
              borderRadius="12px"
              borderColor={error ? 'red.400' : border}
              _focus={{ borderColor: accent, boxShadow: 'none' }}
              fontFamily="var(--font-mono)"
              autoFocus
            />
            {error && (
              <Text fontSize="sm" color="red.400" textAlign="center" mt={2} fontFamily="var(--font-body)">
                Incorrect PIN
              </Text>
            )}
          </FormControl>

          <Button
            type="submit"
            className="accent-gradient"
            style={{ color: '#FFFFFF' }}
            border="none"
            borderRadius="full"
            fontFamily="var(--font-headline)"
            fontWeight={700}
            isDisabled={!pin}
            _hover={{ transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,122,255,0.35)' }}
            transition="all 0.2s"
          >
            Unlock
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default PinGate;
