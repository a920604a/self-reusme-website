import React from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Text, Heading, Button } from "@chakra-ui/react";
import DetailTemplate from "./DetailTemplate"; // 引入共用模板

const WorkDetails = ({ works }) => {
    const { id } = useParams(); // 獲取 URL 中的 id
    const work = works.find((work) => work.id === id); // 根據 id 找到對應的 work

    if (!work) {
        return (
            <Box textAlign="center" mt="120px" px={8}>
                <Heading size="lg" mb={4}>404 - Work Not Found</Heading>
                <Text color="gray.500" mb={6}>The work experience you're looking for doesn't exist.</Text>
                <Button as={Link} to="/" colorScheme="teal">Back to Home</Button>
            </Box>
        );
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