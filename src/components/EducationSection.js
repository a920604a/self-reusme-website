import React from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Heading
} from '@chakra-ui/react';
import FullScreenSection from "./FullScreenSection";

const EducationSection = () => {
    return (
        <FullScreenSection
            backgroundColor="#14532d"
            isDarkBackground
            p={8}
            alignItems="flex-start"
            spacing={8}
        >
            <Heading as="h1" id="Education-section">
                Education
            </Heading>

            <TableContainer>
                <Table size = "lg" colorScheme='blue'>
                    <Thead>
                        <Tr>
                            <Th color="white">School</Th>
                            <Th color="white">Major</Th>
                            <Th color="white">Begin-End</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Master of National Central University	</Td>
                            <Td>Computer science	</Td>
                            <Td>2016-2018
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Bachelor of National Central University	</Td>
                            <Td>Mathematics(minor in computer)	</Td>
                            <Td>2012-2016</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </FullScreenSection>
    );
};

export default EducationSection;

