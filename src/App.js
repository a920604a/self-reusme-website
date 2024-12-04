import React, { Component } from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
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
import axios from "axios";
import { AlertProvider } from "./context/alertContext";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

class App extends Component {

  state = {
    data: null,
  };
  componentDidMount() {
    this.loadData();
  }


  loadData = () => {
    axios
      .get("./propData.json")
      .then((response) => {
        console.log("Received data:", response.data);


        const works = response.data.works.map((work, index) => ({
          ...work,
          id: work.id || `${work.title.toLowerCase().replace(/\s+/g, "-")}-${index}`,
        }));

        const projects = response.data.projects.map((project, index) => ({
          ...project,
          id: project.id || `${project.title.toLowerCase().replace(/\s+/g, "-")}-${index}`,
        }));
        const recommendedProjects = projects
          .filter(
            (project) => project.category === "Work" || project.category === "Misc",
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
            ...response.data,
            recommendedProjects,
            works,
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };



  render() {

    const { data } = this.state;
    if (!data) {
      return <div>Loading...</div>; // 或者返回一個更友好的等待界面
    }
    return (
      <ChakraProvider>
        <main>
          <Router>
            <Header />
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
                    />
                    <EducationSection educationData={data.educationData} />
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
            </Routes>
          </Router>
        </main>
      </ChakraProvider>
    );
  }

}

export default App;
