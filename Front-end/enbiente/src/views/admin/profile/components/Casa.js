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
  const { nome, casaid, endereco, tipocasa, handleOpenModalEditar, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorPrimary1 = useColorModeValue("gray.100", "white");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  
  const bg = useColorModeValue("white", "navy.700");
  return (
    <Card bg={bg} {...rest} p='14px' border='5px' borderColor='grey' w='95%'>
      <Flex justifyContent='center' >
      <Flex align='center'>
      <Box
          bg={textColorSecondary} // Cor de fundo personalizada
          borderRadius='8px'
          h='55px'
          w='55px'
          justifyContent='center'
          display= 'grid'
          justifySelf='center'
          alignContent='center'
        >
        <Icon as={FaHouse}  color={textColorPrimary1} h='50px' w='50px' />
      </Box>
      </Flex>
        <Box ml='10px' mr='5px' mt={{ base: "10px", md: "0" }}>
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
          variant='ghost'
          height='auto'
          ms='auto'
          p='0px !important'
          onClick={handleOpenModalEditar}
          justifyContent='center'>
          <Icon as={MdEdit} color='secondaryGray.500' h='18px' w='18px' />
        </Button>
      </Flex>
    </Card>
  );
}
