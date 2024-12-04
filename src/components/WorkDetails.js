import React from "react";
import { useParams } from "react-router-dom";
import DetailTemplate from "./DetailTemplate"; // 引入共用模板

const WorkDetails = ({ works }) => {
    const { id } = useParams(); // 獲取 URL 中的 id
    const work = works.find((work) => work.id === id); // 根據 id 找到對應的 work

    if (!work) {
        return <Text>Work experience not found.</Text>; // 如果找不到工作資料，顯示錯誤訊息
    }

    return (
        <DetailTemplate
            title={`${work.company} - ${work.position}`}
            subtitle={`${work.position}, ${work.years}`}
            description={Array.isArray(work.description) ? work.description : [work.description]}
            tags={[]}
            index={work.id}
            backLink="/" // 這裡可以設置回到工作經歷列表的鏈接
            backLabel="Works"
        />
    );
};


export default WorkDetails;