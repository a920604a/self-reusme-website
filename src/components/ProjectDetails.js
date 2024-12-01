import React from "react";
import { useParams } from "react-router-dom";
import DetailTemplate from "./DetailTemplate"; // 引入共用模板

const ProjectDetails = ({ projects }) => {
    const { index } = useParams(); // 獲取 URL 中的 id
    const project = projects[parseInt(index)]; // 根據 index 獲取對應的專案資料

    if (!project) {
        return <Text>Project not found.</Text>; // 如果找不到專案，顯示錯誤訊息
    }

    return (
        <DetailTemplate
            title={project.title}
            description={project.description}
            category={project.category}
            tags={project.tags}
            image={project.image}
            reference={project.reference}
            repo={project.repo}
            index={index}
            backLink="/projects" // 這裡可以設置回到專案列表的鏈接
            backLabel="Projects"
        />
    );
};

export default ProjectDetails;