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
import { AlertProvider } from "./context/alertContext";
import Alert from "./components/Alert";
import axios from 'axios';
import React, { Component } from 'react';
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";



class App extends Component {
  state = {
    data: null,
  };

  componentDidMount() {
    axios
      .get("./propData.json")
      .then((response) => {
        console.log("Received data:", response.data); // 檢查獲取的資料

        const projects = response.data.projects;

        // 計算 recommendedProjects
        const recommendedProjects = projects
          .filter(
            (project) => project.category === "Work" || project.category === "Misc"
          )
          .sort((a, b) => {
            const parseDate = (dateStr) => {
              if (!dateStr) return new Date(0); // 如果日期不存在，返回最小值
              if (dateStr.includes("Now")) {
                const [startDate] = dateStr.split("-");
                return new Date(startDate.trim());
              }
              const [startDate] = dateStr.split("-");
              return new Date(startDate.trim());
            };

            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateB - dateA; // 最近日期排在前面
          })
          .slice(0, 5); // 僅取前 5 個

        // 更新 state
        this.setState({
          data: {
            ...response.data,
            recommendedProjects, // 新增推薦項目
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  render() {
    const { data } = this.state;

    if (!data) {
      return <div>Loading...</div>; // 或者其他載入中的內容
    }
    // 從 state 中讀取 recommendedProjects
    const { recommendedProjects } = data;

    console.log("Recommended Projects:", recommendedProjects);

    return (
      <ChakraProvider>
        <AlertProvider>
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
                      {/* <ProjectsSummary projects={recommendedProjects} /> */}
                      <ProjectsCarousel projects={recommendedProjects} />
                      {/* <Box height="50px" /> 這行代碼可以調整空白的高度 */}
                      <WorksSummary works={data.works} />
                      <SkillSection
                        skills={data.skills}
                        tools={data.tools}
                        frameworks={data.frameworks}
                      />
                      <EducationSection educationData={data.educationData} />
                      <Footer />
                    </main>
                  }
                />
                <Route
                  path="/projects"
                  element={<ProjectsPage projects={data.projects} />}
                />
                <Route
                  path="/projects/:index"
                  element={<ProjectDetails projects={data.projects} />}
                />
                <Route
                  path="/works/:index"
                  element={<WorkDetails works={data.works} />}
                />
              </Routes>
            </Router>
          </main>
        </AlertProvider>
      </ChakraProvider>
    );
  }
}

export default App;
