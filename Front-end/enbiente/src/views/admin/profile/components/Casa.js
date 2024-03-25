// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  Button
} from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/card/Card.js";
import React from "react";
// Assets
import { MdEdit, MdHouse } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";

export default function Project(props) {
  const { nome, casaid, endereco, tipocasa, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  
  const bg = useColorModeValue("white", "navy.700");
  return (
    <Card bg={bg} {...rest} p='14px' border='5px' borderColor='grey'>
      <Flex align='center' direction={{ base: "column", md: "row" }}>
      
      <Box
          bg={textColorSecondary} // Cor de fundo personalizada
          borderRadius='8px'
          h='55px'
          w='15%'
          justifyContent='center'
          display= 'grid'
          justifySelf='center'

          alignContent='center'
        >
        <Icon as={FaHouse}  color={textColorPrimary} h='50px' w='50px' />
      </Box>
        <Box mt={{ base: "10px", md: "0" }}>
          <Text
            color={textColorPrimary}
            fontWeight='500'
            fontSize='md'
            mb='4px'>
            {nome}
          </Text>
          <Text
            fontWeight='500'
            color={textColorSecondary}
            fontSize='sm'
            me='4px'>
            {endereco} • {tipocasa}
          </Text>
        </Box>
        <Button
          variant='no-hover'
          me='16px'
          ms='auto'
          p='0px !important'>
          <Icon as={MdEdit} color='secondaryGray.500' h='18px' w='18px' />
        </Button>
      </Flex>
    </Card>
  );
}
