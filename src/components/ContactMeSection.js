import React, { useEffect } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import * as Yup from "yup";
import useSubmit from "../hooks/useSubmit";
import { useAlertContext } from "../context/alertContext";

const ContactMeSection = () => {
  const { isLoading, response, submit } = useSubmit();
  const { onOpen } = useAlertContext();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      subject: "",
      comment: "",
    },
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
      if (response.type === "success") {
        formik.resetForm();
      }
    }
  }, [response]);

  const inputStyles = {
    bg: "whiteAlpha.100",
    border: "1px solid",
    borderColor: "whiteAlpha.300",
    color: "white",
    _placeholder: { color: "whiteAlpha.500" },
    _hover: { borderColor: "teal.400" },
    _focus: { borderColor: "teal.400", boxShadow: "0 0 0 1px #4fd1c5" },
  };

  return (
    <Box
      as="section"
      id="contactme-section"
      bg="#1a1033"
      py={{ base: 12, md: 16 }}
      px={{ base: 4, md: 8, lg: 16 }}
    >
      <Box maxW="680px" mx="auto">
        <Heading as="h2" size="lg" mb={2} textAlign="center" color="white" fontWeight={700}>
          Contact Me
        </Heading>
        <Text textAlign="center" color="whiteAlpha.600" mb={10} fontSize="sm">
          Have a project in mind? Let's talk.
        </Text>

        <Box
          bg="whiteAlpha.100"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="16px"
          p={{ base: 6, md: 8 }}
        >
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={5}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%">
                <FormControl isInvalid={!!formik.errors.firstName && formik.touched.firstName}>
                  <FormLabel color="whiteAlpha.800" fontSize="sm" fontWeight={600}>Name</FormLabel>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Your name"
                    {...formik.getFieldProps("firstName")}
                    {...inputStyles}
                  />
                  <FormErrorMessage fontSize="xs">{formik.errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!formik.errors.email && formik.touched.email}>
                  <FormLabel color="whiteAlpha.800" fontSize="sm" fontWeight={600}>Email</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    {...formik.getFieldProps("email")}
                    {...inputStyles}
                  />
                  <FormErrorMessage fontSize="xs">{formik.errors.email}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <FormControl w="100%">
                <FormLabel color="whiteAlpha.800" fontSize="sm" fontWeight={600}>Subject</FormLabel>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="What's this about?"
                  {...formik.getFieldProps("subject")}
                  {...inputStyles}
                />
              </FormControl>

              <FormControl isInvalid={!!formik.errors.comment && formik.touched.comment} w="100%">
                <FormLabel color="whiteAlpha.800" fontSize="sm" fontWeight={600}>Message</FormLabel>
                <Textarea
                  id="comment"
                  name="comment"
                  placeholder="Tell me about your project..."
                  rows={6}
                  {...formik.getFieldProps("comment")}
                  {...inputStyles}
                  resize="vertical"
                />
                <FormErrorMessage fontSize="xs">{formik.errors.comment}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                size="lg"
                isLoading={isLoading}
                fontWeight={600}
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
