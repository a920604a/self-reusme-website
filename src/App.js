import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import ProjectsSummary from "./components/ProjectsSummary";
import ProjectDetails from "./components/ProjectDetails";
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
    data: null
  };
  componentDidMount() {
    axios.get('./propData.json')
      .then(response => {
        // console.log('Received data:', response.data); // 檢查獲取的資料
        this.setState({ data: response.data });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  render() {
    const { data } = this.state;

    if (!data) {
      return <div>Loading...</div>; // 或者其他載入中的內容
    }


    const recommendedProjects = data.projects.slice(0, 3); // 顯示前三個專案作為推薦項目

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
                      {/* <ProjectsSummary projects={data.projects} /> */}
                      <ProjectsSummary projects={recommendedProjects} />
                      <WorksSummary works={data.works} />
                      <SkillSection skills={data.skills} tools={data.tools} frameworks={data.frameworks} />
                      <EducationSection educationData={data.educationData} />
                      <Footer />
                    </main>
                  }
                />
                {/* <Route path="/projects/:index" element={<ProjectDetails projects={data.projects} />} /> */}
                {/* 项目列表页面 */}
                <Route
                  path="/projects"
                  element={<ProjectsPage projects={data.projects} />}
                />

                {/* 单个项目详情页面 */}
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
