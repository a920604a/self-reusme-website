import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading } from "@chakra-ui/react";
import Card from "./Card";
const projects = [
  {
    title: "Age-related Macular Degeneration Rehabilitation Platform",
    description:
      [
        "為了幫助黃斑部病變病患訓練第二視野中心。",
        "實做出一個復健平台，並整合同事的eye tracking 演算法。",
        "使用Unity 實作外觀、SQLite 作為存儲系統、搭配System service以實現特定功能。",
        "復健平台不僅僅是一個工具，更是一個能夠為醫療團隊提供更便捷工作流程的創新解決方案。"
      ],
    getImageSrc: () => require("../images/amd_flow_chart.png"),
  },
  {
    title: "Remote meeting prototype",
    description:
      [
        "在協助遠端會議系統的專案中，我承擔了提升使用者體驗的使命。",
        "面對不同語系的使用者可能面臨的語言溝通障礙，與其他軟體工程師、UI/UX設計師合作，著手增加語音翻譯和即時字幕功能。",
        "這項任務的動機來自於希望克服語言障礙，讓所有使用者都能流暢參與會議，理解其他語言的內容。透過這項改進，成功地使遠端會議系統更加多元且包容，為使用者提供更豐富、更無障礙的會議體驗。"
      ],
    getImageSrc: () => require("../images/rm2.png"),
  },
  {
    title: "Misc",
    description:
      [
        "在前一份職位中，我面臨了一項挑戰：主管常常在國外，需要每週進行會議。",
        "為了確保他能夠參與，我負責升級會議室，使其能夠支援遠端視訊會議。我的任務包括選擇並整合螢幕和揚聲器，以及整合現有主機與投影機。",
        "為了達到最佳效果，我撰寫了udev規則，觸發自定義的服務，以更好的顯示於投影幕上。整合過程中，我特別關注了udev規則的撰寫，以確保各種解析度的自動最佳化。",
        "結果，我們成功地將會議系統升級，為主管提供了便捷的視訊參與方式，同時也展現了整合軟硬體和解決問題的能力。"
      ],
    getImageSrc: () => require("../images/meeting_room.png"),
  },
  {
    title: "智能缺陷檢測平台",
    description:
      [
        "在這個專案中，整合物件檢測和影像分類演算法，以開發智能檢測平台。",
        "積極與團隊合作，負責建立高效且可擴展的Flask框架後端，整合MySQL作為數據庫，利用docker compose實現容器化部署。",
        "透過asyncio異步編程縮短前端回應時間，提升系統即時性。同時，利用multi-process和多GPU訓練策略，成功縮短訓練時間至原先的3/4，提高效率確保系統順暢運作。",
        "這些優化措施使我們成功實現客戶需求，提供高品質解決方案。"
      ],
    getImageSrc: () => require("../images/aie_adc_train.png"),
  }
];

const ProjectsSection = () => {
  return (
    <FullScreenSection
      backgroundColor="#14532d"
      isDarkBackground
      p={8}
      alignItems="flex-start"
      spacing={8}
      minHeight="50vh"
    >
      <Heading as="h1" id="projects-section">
        Featured Projects
      </Heading>
      <Box
        display="grid"
        gridTemplateColumns="repeat(2,minmax(0,1fr))"
        gridGap={8}
      >
        {projects.map((project) => (
          <Card
            key={project.title}
            title={project.title}
            description={project.description}
            imageSrc={project.getImageSrc()}
          />
        ))}
      </Box>
    </FullScreenSection>
  );
};

export default ProjectsSection;
