import React from "react";
import { useParams } from "react-router-dom";
import DetailTemplate from "./DetailTemplate"; // 引入共用模板

const WorkDetails = ({ works }) => {
    const { index } = useParams(); // 從 URL 獲取工作經歷的 index
    const work = works[parseInt(index)]; // 根據 index 獲取對應的工作資料

    if (!work) {
        return <Text>Work experience not found.</Text>; // 如果找不到工作資料，顯示錯誤訊息
    }

    return (
        <DetailTemplate
            title={`${work.company} - ${work.position}`}
            subtitle={`${work.position}, ${work.years}`}
            description={Array.isArray(work.description) ? work.description : [work.description]}
            tags={[]}
            index={index}
            backLink="/" // 這裡可以設置回到工作經歷列表的鏈接
            backLabel="Works"
        />
    );
};


export default WorkDetails;