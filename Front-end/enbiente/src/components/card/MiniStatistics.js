// Chakra imports
// Chakra imports
import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
// Custom components
import Card from "../../components/card/Card.js";
// Custom icons
import React from "react";

export default function Default(props) {
  const { startContent, endContent, name, growth, value, poupadoeuros } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";

  return (
    <Card py='15px'>
      <Flex
        my='auto'
        h='100%'
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}>
        {startContent}

        <Stat my='auto' ms={startContent ? "18px" : "0px"}>
          <StatLabel
            lineHeight='100%'
            color={textColorSecondary}
            fontSize={{
              base: "sm",
            }}>
            {name}
          </StatLabel>
          <StatNumber
            color={textColor}
            fontSize={{
              base: "xl",
            }}>
            {value}
            {poupadoeuros}
          </StatNumber>
          {growth || growth == 0.0 ? (
            <Flex align='center'>
              <Text
                color={growth > 0 ? 'red.500' : 'green.500'}
                fontSize='s'
                fontWeight='700'
                me='5px'>
                {growth + " %"}
              </Text>
              <Text
                color='secondaryGray.600'
                fontSize='xs'
                fontWeight='400'>
                desde o último mês
              </Text>
            </Flex>
          ) : null}
        </Stat>
        <Flex ms='auto' w='max-content'>
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
