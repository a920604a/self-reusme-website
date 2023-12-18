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
import ProjectDetails from "./components/ProjectDetails";
import ContactMe from "./components/ContactMe";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ChakraProvider>
      <AlertProvider>
        <main>

          <Routes>

            <Route path="/" element={
              <>
                <Header />
                <LandingSection />
                <ProjectsSection />
                <WorkExperienceSection />
                {/* <ContactMeSection /> */}
                <SkillSection />
                <EducationSection />
                {/* <Footer /> */}
                {/* <Alert /> */}
              </>
            } />

            <Route path="projects" element={
              <>
                <Header />
                <ProjectDetails />
              </>
            } />
            <Route path="contact-me" element={
              <>
                <Header />
                <ContactMe />
              </>
            } />
          </Routes>



        </main>
      </AlertProvider>
    </ChakraProvider>
  );
}

export default App;
