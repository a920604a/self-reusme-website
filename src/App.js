import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactMeSection from "./components/ContactMeSection";
import SkillSection from "./components/SkillSection";
import WorkExperienceSection from "./components/WorkExperienceSection";
import EducationSection from "./components/EducationSection";
import Footer from "./components/Footer";
import { AlertProvider } from "./context/alertContext";
import Alert from "./components/Alert";
import axios from 'axios';
import React, { Component } from 'react';


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



    return (

      <ChakraProvider>
        <AlertProvider>
          <main>
            <Header />
            <LandingSection greeting={data.greeting} bio1={data.bio1} bio2={data.bio2} resumeDownload={data.resumeDownload} />
            <ProjectsSection projects={data.projects} />
            <WorkExperienceSection works={data.works} />

            <SkillSection skills={data.skills} tools={data.tools} frameworks={data.frameworks} />
            <EducationSection educationData={data.educationData} />
            {/* <ContactMeSection /> */}
            <Footer />
            {/* <Alert /> */}


          </main>
        </AlertProvider>
      </ChakraProvider>

    );
  }
}
export default App;
