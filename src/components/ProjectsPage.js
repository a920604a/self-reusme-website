import React, { useState } from "react";
import {
  Box, Heading, Text, Flex, Button, Select, Stack, useColorModeValue,
} from "@chakra-ui/react";
import ProjectsSummary from "./ProjectsSummary";

const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  const base = dateStr.includes("Now") ? dateStr.split("-")[0] : dateStr.split("-")[0];
  return new Date(base.trim());
};

const ProjectsPage = ({ projects }) => {
  const bgCanvas     = useColorModeValue("#FFFFFF", "#000000");
  const labelPrimary = useColorModeValue("#000000", "#FFFFFF");
  const labelSecond  = useColorModeValue("rgba(60,60,67,0.6)", "rgba(235,235,245,0.6)");
  const labelTertiary = useColorModeValue("rgba(60,60,67,0.3)", "rgba(235,235,245,0.3)");
  const accent       = useColorModeValue("#007AFF", "#0A84FF");
  const accentSoft   = useColorModeValue("rgba(0,122,255,0.12)", "rgba(10,132,255,0.2)");
  const bgFill       = useColorModeValue("rgba(120,120,128,0.2)", "rgba(120,120,128,0.36)");
  const borderColor  = useColorModeValue("#C6C6C8", "#38383A");

  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagsFilter,     setTagsFilter]     = useState("");
  const [sort,           setSort]           = useState("date DESC");

  const categories = [...new Set(projects.map((p) => p.category))];
  const allTags    = [...new Set(projects.flatMap((p) => p.tags))];

  const filtered = projects
    .filter((p) => {
      const hasDesc = p.description && Object.keys(p.description).length > 0;
      const matchCat = categoryFilter ? p.category === categoryFilter : true;
      const matchTag = tagsFilter
        ? p.tags.some((t) => t.toLowerCase().includes(tagsFilter.toLowerCase()))
        : true;
      return hasDesc && matchCat && matchTag;
    })
    .sort((a, b) => {
      if (sort === "date ASC") return parseDate(a.date) - parseDate(b.date);
      if (sort === "date DESC") return parseDate(b.date) - parseDate(a.date);
      if (sort === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const selectStyles = {
    bg: bgFill,
    border: "1px solid",
    borderColor: borderColor,
    color: labelPrimary,
    borderRadius: "8px",
    fontSize: "sm",
    _hover: { borderColor: accent },
    _focus: { borderColor: accent, boxShadow: "none" },
  };

  return (
    <Box bg={bgCanvas} minH="100vh" pt="90px" pb={20} px={{ base: 4, md: 8 }}>
      <Box maxW="1200px" mx="auto">

        {/* Header */}
        <Box mb={10} textAlign="center">
          <Text
            fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
            textTransform="uppercase" mb={3} style={{ color: accent }}
          >
            Portfolio Archive
          </Text>
          <Heading
            fontFamily="var(--font-headline)" fontWeight="800"
            fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
            style={{ color: labelPrimary }}
          >
            All Projects
          </Heading>
        </Box>

        {/* Category filter pills */}
        <Flex wrap="wrap" gap={2} justify="center" mb={6}>
          <Button
            size="sm" borderRadius="full" px={5}
            fontFamily="var(--font-label)" fontWeight={600} fontSize="xs"
            letterSpacing="wide"
            bg={categoryFilter === "" ? accentSoft : bgFill}
            color={categoryFilter === "" ? accent : labelSecond}
            border={categoryFilter === "" ? `1px solid ${accent}` : `1px solid ${borderColor}`}
            _hover={{ bg: categoryFilter === "" ? accentSoft : bgFill, opacity: 0.8 }}
            onClick={() => setCategoryFilter("")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat} size="sm" borderRadius="full" px={5}
              fontFamily="var(--font-label)" fontWeight={600} fontSize="xs"
              letterSpacing="wide"
              bg={categoryFilter === cat ? accentSoft : bgFill}
              color={categoryFilter === cat ? accent : labelSecond}
              border={categoryFilter === cat ? `1px solid ${accent}` : `1px solid ${borderColor}`}
              _hover={{ bg: categoryFilter === cat ? accentSoft : bgFill, opacity: 0.8 }}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </Flex>

        {/* Tag + Sort filters */}
        <Flex gap={4} justify="center" mb={8} wrap="wrap">
          <Select
            placeholder="Filter by tag"
            value={tagsFilter}
            onChange={(e) => setTagsFilter(e.target.value)}
            maxW="220px"
            {...selectStyles}
          >
            {allTags.map((tag) => (
              <option key={tag} value={tag} style={{ background: "var(--color-elevated)" }}>{tag}</option>
            ))}
          </Select>

          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            maxW="200px"
            {...selectStyles}
          >
            <option value="date DESC" style={{ background: "var(--color-elevated)" }}>Newest First</option>
            <option value="date ASC"  style={{ background: "var(--color-elevated)" }}>Oldest First</option>
            <option value="title"     style={{ background: "var(--color-elevated)" }}>By Title</option>
          </Select>
        </Flex>

        {/* Count */}
        <Text
          textAlign="center" mb={8}
          fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
          textTransform="uppercase" style={{ color: labelSecond }}
        >
          {filtered.length} Project{filtered.length !== 1 ? "s" : ""}
        </Text>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Text textAlign="center" style={{ color: labelSecond }}>No projects found.</Text>
        ) : (
          <ProjectsSummary projects={filtered} />
        )}

        {/* Back to top */}
        <Box textAlign="center" mt={14}>
          <Button
            size="sm" variant="ghost"
            fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
            textTransform="uppercase" style={{ color: accent }}
            _hover={{ bg: "rgba(192,193,255,0.06)" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            ↑ Back to Top
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectsPage;
