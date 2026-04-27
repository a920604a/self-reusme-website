import React, { Component } from "react";
import { ChakraProvider, Spinner, Center, Text, Button, Heading, Box } from "@chakra-ui/react";
import theme from "./theme";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import ProjectsSummary from "./components/ProjectsSummary";
import ProjectDetails from "./components/ProjectDetails";
import ProjectsCarousel from "./components/ProjectsCarousel";
import ProjectsPage from "./components/ProjectsPage";
import ContactMeSection from "./components/ContactMeSection";
import SkillSection from "./components/SkillSection";
import WorksSummary from "./components/WorksSummary";
import WorkDetails from "./components/WorkDetails";
import EducationSection from "./components/EducationSection";
import Footer from "./components/Footer";
import FloatingChatWidget from "./components/FloatingChatWidget";
import JDAnalyzer from "./components/JDAnalyzer";
import axios from "axios";
import { AlertProvider } from "./context/alertContext";
import { LocaleProvider } from "./context/LocaleContext";
import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from "react-router-dom";

class App extends Component {

  state = {
    data: null,
    loadError: false,
  };
  componentDidMount() {
    this.loadData();
  }


  loadData = () => {
    Promise.all([
      axios.get("./data/profile.json"),
      axios.get("./data/projects.json"),
      axios.get("./data/works.json"),
      axios.get("./data/skills.json"),
      axios.get("./data/education.json"),
    ])
      .then(([profile, projectsRes, worksRes, skillsRes, educationRes]) => {
        const works = worksRes.data.map((work, index) => ({
          ...work,
          id: work.id || `${(work.position || "unknown").toLowerCase().replace(/\s+/g, "-")}-${index}`,
        }));

        const projects = projectsRes.data.map((project, index) => ({
          ...project,
          id: project.id || `${project.title.toLowerCase().replace(/\s+/g, "-")}-${index}`,
        }));

        const recommendedProjects = projects
          .filter(
            (project) => project.category === "Work" || project.category === "Side Project",
          )
          .sort((a, b) => {
            const parseDate = (dateStr) => {
              if (!dateStr) return new Date(0);
              if (dateStr.includes("Now")) {
                const [startDate] = dateStr.split("-");
                return new Date(startDate.trim());
              }
              const [startDate] = dateStr.split("-");
              return new Date(startDate.trim());
            };

            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateB - dateA;
          })
          .slice(0, 5);

        this.setState({
          data: {
            ...profile.data,
            projects,
            works,
            recommendedProjects,
            ...skillsRes.data,
            educationData: educationRes.data,
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({ loadError: true });
      });
  };



  render() {

    const { data } = this.state;
    if (!data) {
      return (
        <ChakraProvider theme={theme}>
          <Center minH="100vh" bg="bg.canvas" flexDirection="column" gap={4}>
            {this.state.loadError ? (
              <>
                <Text color="red.400" fontFamily="var(--font-headline)" fontSize="xl">
                  Failed to load portfolio data
                </Text>
                <Text color="label.secondary" fontSize="sm">
                  Please refresh the page or try again later.
                </Text>
              </>
            ) : (
              <Spinner size="xl" color="accent" thickness="4px" speed="0.65s" />
            )}
          </Center>
        </ChakraProvider>
      );
    }
    return (
      <ChakraProvider theme={theme}>
        <LocaleProvider>
        <AlertProvider>
          <main>
            <Router>
              <FloatingChatWidget projectIds={(data?.projects || []).map(p => p.id)} />
              <Header email={data?.email} />
              <Routes>
                <Route
                  path="/"
                  element={
                    <main>
                      <LandingSection
                        greeting={data.greeting}
                        bio1={data.bio1}
                        bio2={data.bio2}
                        resumeDownload={data.resumeDownload}
                      />
                      <ProjectsCarousel projects={data.recommendedProjects} />
                      {/* <ProjectsSummary projects={data.recommendedProjects} /> */}
                      <WorksSummary works={data.works} />
                      <SkillSection
                        skills={data.skills}
                        tools={data.tools}
                        frameworks={data.frameworks}
                        tryLearn={data.tryLearn}
                      />
                      <EducationSection educationData={data.educationData} />
                      <ContactMeSection />
                      <Footer data={data} fileName="CV.json" />
                    </main>

                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProjectsPage projects={data.projects} />
                  }
                />
                <Route
                  path="/projects/:id"
                  element={<ProjectDetails projects={data.projects} />}
                />
                <Route
                  path="/works/:id"
                  element={<WorkDetails works={data.works} />}
                />
                <Route
                  path="/jd-analyzer"
                  element={<JDAnalyzer projectIds={(data?.projects || []).map(p => p.id)} />}
                />
                <Route
                  path="*"
                  element={
                    <Box textAlign="center" mt="140px" px={8}>
                      <Heading
                        fontFamily="var(--font-headline)"
                        fontWeight="800"
                        fontSize="5xl"
                        style={{ color: "#c0c1ff" }}
                        mb={4}
                      >
                        404
                      </Heading>
                      <Text color="label.secondary" mb={6} fontFamily="var(--font-body)">
                        Page not found.
                      </Text>
                      <Button
                        as={RouterLink}
                        to="/"
                        fontFamily="var(--font-headline)"
                        fontWeight={700}
                        className="accent-gradient"
                        style={{ color: "#FFFFFF" }}
                        border="none"
                      >
                        Back to Home
                      </Button>
                    </Box>
                  }
                />
              </Routes>
            </Router>
          </main>
        </AlertProvider>
        </LocaleProvider>
      </ChakraProvider>
    );
  }

}

export default App;
