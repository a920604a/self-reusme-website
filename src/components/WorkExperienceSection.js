import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Text, Heading, VStack } from "@chakra-ui/react";
import Card from "./Card";


const works = [
    {
        "company": "Oomii Inc.",
        "position": "Software Engineer",
        "years": "March 2022 - Present",
        "description": [
            "使用Unity框架、C#進行後端開發",
            "使用Ansible自動化部署至其他環境",
            "使用Figma工具與進行UI/UX設計密切合作",
            "協助部署遠端會議原型",
            "建立會議室系統，以便遠端使用者參與會議"
        ]
    },
    {
        "company": "Asus Inc. AICS department",
        "position": "System Engineer",
        "years": "November 2021 - Feburary 2022",
        "description": [
            "負責維護ETL流程，使用Airflow進行每日數百萬條記錄的同步，涉及不同類型的數據集。這項經驗不僅強化了我的Airflow技能，還培養了我在大規模數據同步和ETL管理方面的專業能力。"
        ]
    },
    {
        "company": "安智聯科技有限公司",
        "position": "Algorithm Development Engineer",
        "years": "April 2020 - March 2021",
        "description": [
            "整合物件檢測和影像分類演算法，以開發智能檢測平台。",
            "積極與團隊合作，負責建立高效且可擴展的 Flask 網站後端。",
            "整合 MySQL 作為數據庫，利用 Docker Compose 實現容器化部署。"
        ]
    },
    {
        "company": "FOXCONN",
        "position": "Software Engineer Intern",
        "years": "July 2018 - October 2018",
        "description": [
            "應用了Python程式語言，使用了TensorFlow和Keras框架，成功開發了深度學習演算法，提高了檢測系統的效能並取得了顯著的成就。"
        ]
    }
];

const WorkExperienceSection = () => {
    return (
        <FullScreenSection
            backgroundColor="#88f2d6"
            p={8}
            alignItems="flex-start"
            spacing={8}
        >
            <Heading as="h1" id="work-experience-section">
                Work Experience
            </Heading>

            {works.map((work, index) => (

                <VStack key={index} style={{
                    padding: '10px',
                }} alignItems="flex-start">

                    <Heading size="xl" >{work.company}</Heading>
                    <Heading size="md" >{work.position}, {work.years}</Heading>

                    {Array.isArray(work.description) ? (
                        <VStack alignItems="flex-start">
                            {work.description.map((desc, i) => (
                                <Text key={i} style={{ color: 'gray' }}>
                                    <li>{desc}</li>
                                </Text>
                            ))}
                        </VStack>
                    ) : (
                        <Text style={{ color: 'gray' }}><li>{work.description}</li></Text>
                    )}


                </VStack>

            ))}


        </FullScreenSection >
    );
};

export default WorkExperienceSection;
