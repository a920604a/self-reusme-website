import React, { useEffect } from "react";
import { useFormik } from "formik";
import {
  Box, Button, FormControl, FormErrorMessage, FormLabel,
  Heading, Input, Textarea, VStack, Text, SimpleGrid,
} from "@chakra-ui/react";
import * as Yup from "yup";
import useSubmit from "../hooks/useSubmit";
import { useAlertContext } from "../context/alertContext";

const ContactMeSection = () => {
  const { isLoading, response, submit } = useSubmit();
  const { onOpen } = useAlertContext();

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
    bg: "#222a3d",
    border: "1px solid",
    borderColor: "#464554",
    color: "#dae2fd",
    borderRadius: "10px",
    fontFamily: "var(--font-body)",
    fontSize: "sm",
    _placeholder: { color: "#908fa0" },
    _hover: { borderColor: "#c0c1ff" },
    _focus: { borderColor: "#c0c1ff", boxShadow: "0 0 0 1px #c0c1ff" },
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
      bg="#0b1326"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
    >
      <Box maxW="680px" mx="auto">

        {/* Header */}
        <Box mb={10} textAlign="center">
          <Text
            fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
            textTransform="uppercase" mb={3} style={{ color: "#5de6ff" }}
          >
            Get in Touch
          </Text>
          <Heading
            as="h2"
            fontFamily="var(--font-headline)" fontWeight="800"
            fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
            style={{ color: "#dae2fd" }}
          >
            Contact Me
          </Heading>
          <Text
            mt={3} fontFamily="var(--font-body)" fontSize="sm"
            style={{ color: "#908fa0" }}
          >
            Have a project in mind? Let's talk.
          </Text>
        </Box>

        {/* Form card */}
        <Box
          bg="#131b2e"
          border="1px solid #464554"
          borderRadius="20px"
          p={{ base: 6, md: 8 }}
        >
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={5}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%">
                <FormControl isInvalid={!!formik.errors.firstName && formik.touched.firstName}>
                  <FormLabel {...labelStyle}>Name</FormLabel>
                  <Input
                    id="firstName" name="firstName"
                    placeholder="Your name"
                    {...formik.getFieldProps("firstName")}
                    {...inputStyle}
                  />
                  <FormErrorMessage fontSize="xs">{formik.errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!formik.errors.email && formik.touched.email}>
                  <FormLabel {...labelStyle}>Email</FormLabel>
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
                <FormLabel {...labelStyle}>Subject</FormLabel>
                <Input
                  id="subject" name="subject"
                  placeholder="What's this about?"
                  {...formik.getFieldProps("subject")}
                  {...inputStyle}
                />
              </FormControl>

              <FormControl isInvalid={!!formik.errors.comment && formik.touched.comment} w="100%">
                <FormLabel {...labelStyle}>Message</FormLabel>
                <Textarea
                  id="comment" name="comment"
                  placeholder="Tell me about your project..."
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
                className="editorial-gradient"
                style={{ color: "#1000a9" }}
                border="none"
                borderRadius="10px"
                fontFamily="var(--font-headline)"
                fontWeight={700}
                fontSize="sm"
                letterSpacing="wide"
                _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Send Message
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactMeSection;
