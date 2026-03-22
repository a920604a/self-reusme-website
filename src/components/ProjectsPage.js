import React, { useState } from "react";
import {
  Box, Heading, Text, Flex, Button, Select, Stack,
} from "@chakra-ui/react";
import ProjectsSummary from "./ProjectsSummary";

const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  const base = dateStr.includes("Now") ? dateStr.split("-")[0] : dateStr.split("-")[0];
  return new Date(base.trim());
};

const ProjectsPage = ({ projects }) => {
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
    bg: "#222a3d",
    border: "1px solid #464554",
    color: "#dae2fd",
    borderRadius: "8px",
    fontSize: "sm",
    _hover: { borderColor: "#c0c1ff" },
    _focus: { borderColor: "#c0c1ff", boxShadow: "none" },
  };

  return (
    <Box bg="#0b1326" minH="100vh" pt="90px" pb={20} px={{ base: 4, md: 8 }}>
      <Box maxW="1200px" mx="auto">

        {/* Header */}
        <Box mb={10} textAlign="center">
          <Text
            fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
            textTransform="uppercase" mb={3} style={{ color: "#5de6ff" }}
          >
            Portfolio Archive
          </Text>
          <Heading
            fontFamily="var(--font-headline)" fontWeight="800"
            fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em"
            style={{ color: "#dae2fd" }}
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
            bg={categoryFilter === "" ? "#c0c1ff" : "#222a3d"}
            color={categoryFilter === "" ? "#1000a9" : "#c7c4d7"}
            border={categoryFilter === "" ? "none" : "1px solid #464554"}
            _hover={{ bg: categoryFilter === "" ? "#c0c1ff" : "#2d3449" }}
            onClick={() => setCategoryFilter("")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat} size="sm" borderRadius="full" px={5}
              fontFamily="var(--font-label)" fontWeight={600} fontSize="xs"
              letterSpacing="wide"
              bg={categoryFilter === cat ? "#c0c1ff" : "#222a3d"}
              color={categoryFilter === cat ? "#1000a9" : "#c7c4d7"}
              border={categoryFilter === cat ? "none" : "1px solid #464554"}
              _hover={{ bg: categoryFilter === cat ? "#c0c1ff" : "#2d3449" }}
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
              <option key={tag} value={tag} style={{ background: "#222a3d" }}>{tag}</option>
            ))}
          </Select>

          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            maxW="200px"
            {...selectStyles}
          >
            <option value="date DESC" style={{ background: "#222a3d" }}>Newest First</option>
            <option value="date ASC"  style={{ background: "#222a3d" }}>Oldest First</option>
            <option value="title"     style={{ background: "#222a3d" }}>By Title</option>
          </Select>
        </Flex>

        {/* Count */}
        <Text
          textAlign="center" mb={8}
          fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
          textTransform="uppercase" style={{ color: "#908fa0" }}
        >
          {filtered.length} Project{filtered.length !== 1 ? "s" : ""}
        </Text>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Text textAlign="center" style={{ color: "#908fa0" }}>No projects found.</Text>
        ) : (
          <ProjectsSummary projects={filtered} />
        )}

        {/* Back to top */}
        <Box textAlign="center" mt={14}>
          <Button
            size="sm" variant="ghost"
            fontFamily="var(--font-label)" fontSize="xs" letterSpacing="widest"
            textTransform="uppercase" style={{ color: "#c0c1ff" }}
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
