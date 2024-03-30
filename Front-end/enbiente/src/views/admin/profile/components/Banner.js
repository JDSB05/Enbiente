// Chakra imports
import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "../../../../components/card/Card.js";
import React from "react";

export default function Banner(props) {
  const { banner, avatar, nome, email, posts, followers, following, fotolink } = props;
  // Chakra Color Mode

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center'>
      <Box
        bg={`url(${banner})`}
        bgSize='cover'
        borderRadius='16px'
        h='131px'
        w='100%'
      />
      <Avatar
        mx='auto'
        name={nome}
        src={fotolink}
        h='87px'
        w='87px'
        mt='-43px'
        border='4px solid'
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
        {nome}
      </Text>
      <Text color={textColorSecondary} fontSize='sm'>
        {email}
      </Text>
      <Flex w='100%' mx='auto' mt='26px'>
        <Flex mx='auto'  align='left' direction='column' w='33%'>
          <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
            {posts}
          </Text>
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            Casas
          </Text>
        </Flex>
        <Flex mx='auto'  align='center' direction='column' w='33%'>
          <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
            {followers}
          </Text>
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            Volume total consumido
          </Text>
        </Flex>
        <Flex mx='auto' align='right' direction='column' w='33%'>
          <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
            {following}
          </Text>
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            Euros gastos
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
