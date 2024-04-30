// chakra imports
import { Icon, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { MdOutlineWaterDrop } from "react-icons/md";
import { IoMailUnread, IoMailOpen } from "react-icons/io5";
import React from "react";

export function ItemContent(props) {
  const textColor = useColorModeValue("navy.700", "white");
  const alerta_id = props.alerta_id;
  return (
    <>
      <Flex
        justify='center'
        align='center'
        borderRadius='16px'
        minH={{ base: "60px", md: "70px" }}
        h={{ base: "60px", md: "70px" }}
        minW={{ base: "60px", md: "70px" }}
        w={{ base: "60px", md: "70px" }}
        me='14px'
        bg='linear-gradient(135deg, #868CFF 0%, #4318FF 100%)'>
        <Icon as={MdOutlineWaterDrop } color='white' w={8} h={14} />
      </Flex>
      <Flex flexDirection='column'>
        <Text
          mb='5px'
          fontWeight='bold'
          color={textColor}
          fontSize={{ base: "md", md: "md" }}>
          {props.casa}: {props.tipoalerta}
        </Text>
        <Flex alignItems='center'>
          <Text
            fontSize={{ base: "sm", md: "sm" }}
            lineHeight='100%'
            color={textColor}>
            {props.descricao}
          </Text>
        </Flex>
      </Flex>
      <Flex>
        <Text
          fontSize={{ base: "sm", md: "sm" }}
          color={textColor}
          ms='10px'
          onClick={() => {
            // Verifica se o alerta já foi lido antes de chamar a função marcarlida
            if (props.estado) {
              props.marcarlida(alerta_id);
            }
          }}
          title="Marcar como lida" // Adiciona a dica de ferramenta
        >
          {props.estado ? <Icon as={IoMailUnread} w={8} h={8} /> : <Icon as={IoMailOpen} w={8} h={14} />}
        </Text>
      </Flex>
    </>
  );
}
