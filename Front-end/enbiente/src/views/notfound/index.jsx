/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   ____  ____   ___  
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| |  _ \|  _ \ / _ \ 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || |  | |_) | |_) | | | |
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |  |  __/|  _ <| |_| |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___| |_|   |_| \_\\___/ 
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.horizon-ui.com/pro/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Flex, Image, Link, Text, useColorModeValue, Button } from "@chakra-ui/react";

// Assets
import error from "assets/img/error.png";
import React from "react";
import { useHistory } from "react-router-dom";

function Alerts() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "brand.400");
  const history = useHistory();
  function sendToHome() {
    window.location.href = "/";
  }
  return (
    <Flex direction='column' align='center' pt={{ sm: "125px", lg: "75px" }}>
      <Image
        src={error}
        w='400px'
        maxW='90%'
        mt={{ base: "4vh", lg: "20vh" }}
        mb='10px'
      />
      <Text
        color={textColor}
        fontSize={{ base: "40px", lg: "46px" }}
        fontWeight='700'
        mb='30px'
        textAlign={{ base: "center", md: "start" }}>
        Não encontramos a página que procura
      </Text>
      <Flex align='center' direction={{ base: "column", md: "row" }}>
        <Text
          color={textColor}
          fontWeight='500'
          fontSize={{ base: "md", md: "lg" }}
          me='4px'>
          Carregue no botão para voltar à página inicial
        </Text>
      </Flex>
      <Flex w='100%' maxW='200px' mt='20px'>
        <Button
              onClick={sendToHome}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              href='/'
              w='100%'
              h='50'
              mb='24px'>
              Página inicial
            </Button>
      </Flex>
    </Flex>
  );
}

export default Alerts;