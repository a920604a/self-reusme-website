import React, { useEffect } from "react";
import { useFormik } from "formik";
import {
  Box, Button, FormControl, FormErrorMessage, FormLabel,
  Heading, Input, Textarea, VStack, Text, SimpleGrid,
} from "@chakra-ui/react";
import * as Yup from "yup";
import useSubmit from "../hooks/useSubmit";
import { useAlertContext } from "../context/alertContext";
import { useColorModeValue } from "@chakra-ui/react";
import { useLocaleContext } from "../context/LocaleContext";

const ContactMeSection = () => {
  const { t } = useLocaleContext();
  const { isLoading, response, submit } = useSubmit();
  const { onOpen } = useAlertContext();
  const bgCanvas    = useColorModeValue("#FFFFFF", "#000000");
  const bgElevated  = useColorModeValue("#FFFFFF", "#2C2C2E");
  const bgFill      = useColorModeValue("rgba(120,120,128,0.1)", "rgba(120,120,128,0.36)");
  const labelPrimary = useColorModeValue("#000000", "#FFFFFF");
  const labelSecond  = useColorModeValue("rgba(60,60,67,0.6)", "rgba(235,235,245,0.6)");
  const accent       = useColorModeValue("#007AFF", "#0A84FF");
  const accentSoft   = useColorModeValue("rgba(0,122,255,0.2)", "rgba(10,132,255,0.2)");
  const borderColor  = useColorModeValue("#C6C6C8", "#38383A");

  const formik = useFormik({
    initialValues: { firstName: "", email: "", subject: "", comment: "" },
    onSubmit: (values) => { submit("", values); },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      comment: Yup.string().min(25, "Must be at least 25 characters").required("Required"),
    }),
  });

  useEffect(() => {
    if (response) {
      onOpen(response.type, response.message);
      if (response.type === "success") formik.resetForm();
    }
  }, [response]);

  const inputStyle = {
    bg: bgFill,
    border: "1px solid",
    borderColor: borderColor,
    color: labelPrimary,
    borderRadius: "12px",
    fontFamily: "var(--font-body)",
    fontSize: "sm",
    _placeholder: { color: labelSecond },
    _hover: { borderColor: accent },
    _focus: { borderColor: accent, boxShadow: `0 0 0 3px ${accentSoft}` },
  };

  const labelStyle = {
    color: "#c7c4d7",
    fontSize: "sm",
    fontFamily: "var(--font-label)",
    fontWeight: 600,
    letterSpacing: "wide",
    mb: 1,
  };

  return (
    <Box
      as="section"
      id="contactme-section"
      bg={bgCanvas}
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
    >
      <Box maxW="680px" mx="auto">

        {/* Header */}
        <Box mb={10} textAlign="center">
          <Text
            fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
            textTransform="uppercase" mb={3} style={{ color: accent }}
          >
            {t('contact.eyebrow') || 'Get in Touch'}
          </Text>
          <Heading
            as="h2"
            fontFamily="var(--font-headline)" fontWeight="800"
            fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
            style={{ color: labelPrimary }}
          >
            {t('contact.title') || 'Contact Me'}
          </Heading>
          <Text
            mt={3} fontFamily="var(--font-body)" fontSize="sm"
            style={{ color: labelSecond }}
          >
            {t('contact.subtitle') || "Have a project in mind? Let's talk."}
          </Text>
        </Box>

        {/* Form card */}
        <Box
          bg={bgElevated}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="20px"
          p={{ base: 6, md: 8 }}
        >
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={5}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%">
                <FormControl isInvalid={!!formik.errors.firstName && formik.touched.firstName}>
                  <FormLabel {...labelStyle}>{t('contact.nameLabel') || 'Name'}</FormLabel>
                  <Input
                    id="firstName" name="firstName"
                    placeholder={t('contact.namePlaceholder') || "Your name"}
                    {...formik.getFieldProps("firstName")}
                    {...inputStyle}
                  />
                  <FormErrorMessage fontSize="xs">{formik.errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!formik.errors.email && formik.touched.email}>
                  <FormLabel {...labelStyle}>{t('contact.emailLabel') || 'Email'}</FormLabel>
                  <Input
                    id="email" name="email" type="email"
                    placeholder="your@email.com"
                    {...formik.getFieldProps("email")}
                    {...inputStyle}
                  />
                  <FormErrorMessage fontSize="xs">{formik.errors.email}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <FormControl w="100%">
                <FormLabel {...labelStyle}>{t('contact.subjectLabel') || 'Subject'}</FormLabel>
                <Input
                  id="subject" name="subject"
                  placeholder={t('contact.subjectPlaceholder') || "What's this about?"}
                  {...formik.getFieldProps("subject")}
                  {...inputStyle}
                />
              </FormControl>

              <FormControl isInvalid={!!formik.errors.comment && formik.touched.comment} w="100%">
                <FormLabel {...labelStyle}>{t('contact.messageLabel') || 'Message'}</FormLabel>
                <Textarea
                  id="comment" name="comment"
                  placeholder={t('contact.messagePlaceholder') || "Tell me about your project..."}
                  rows={6}
                  resize="vertical"
                  {...formik.getFieldProps("comment")}
                  {...inputStyle}
                />
                <FormErrorMessage fontSize="xs">{formik.errors.comment}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                width="full"
                size="lg"
                isLoading={isLoading}
                className="accent-gradient"
                style={{ color: "#FFFFFF" }}
                border="none"
                borderRadius="10px"
                fontFamily="var(--font-headline)"
                fontWeight={700}
                fontSize="sm"
                letterSpacing="wide"
                _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                {t('contact.submit') || 'Send Message'}
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactMeSection;
