// Chakra imports
import { Flex, Text, useColorModeValue, Button, Icon } from "@chakra-ui/react";
// Assets
import Project1 from "../../../../assets/img/profile/Project1.png";
import Project2 from "../../../../assets/img/profile/Project2.png";
import Project3 from "../../../../assets/img/profile/Project3.png";
// Custom components
import Card from "../../../../components/card/Card.js";
import React from "react";
import Project from "./Casa";
import { MdAdd } from "react-icons/md";

export default function Projects(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card mb={{ base: "0px", "2xl": "20px" }}>
      <Flex w='100%' mb='5px'>
        <Flex w='50%' mx='auto' me='60px' align='left' direction='column'>
          <Text
            color={textColorPrimary}
            fontWeight='bold'
            fontSize='2xl'
            mt='10px'
            mb='4px'>
            Casas
          </Text>
        </Flex>
        <Flex w='50%' justifyContent="right" alignItems='center' >
          <Button
            w='auto'
            variant='solid'
            >
            <MdAdd size={15} color={textColorPrimary} />
          </Button>
        </Flex>
      </Flex>
      <Project
        boxShadow={cardShadow}
        mb='20px'
        image={Project1}
        ranking='1'
        link='#'
        title='Technology behind the Blockchain'
      />
      <Project
        boxShadow={cardShadow}
        mb='20px'
        image={Project2}
        ranking='2'
        link='#'
        title='Greatest way to a good Economy'
      />
      <Project
        boxShadow={cardShadow}
        image={Project3}
        ranking='3'
        link='#'
        title='Most essential tips for Burnout'
      />
    </Card>
  );
}
