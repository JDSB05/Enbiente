/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  let textColor = useColorModeValue("gray.400", "white");
  let linkColor = useColorModeValue("gray.400", "white");
  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: "column",
        lg: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px={{ base: "30px", md: "0px" }}
      pb='30px'>
      <Text
        color={textColor}
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", lg: "0px" }}>
        {" "}
        &copy; {1900 + new Date().getYear()}
        <Text as='span' fontWeight='500' ms='4px'>
          AquaTrack. Todos os direitos reservados. Plataforma feita para
          <Link
            mx='3px'
            color={textColor}
            href='https://www.enbiente.com'
            target='_blank'
            fontWeight='700'>
            Enbiente
          </Link>
          &copy;
        </Text>
        {" "}
        <Link
            fontWeight='600'
            color={linkColor}
            href='mailto:geral@enbiente.com?subject=Plataforma AquaTrack'>
            Suporte
          </Link>
      </Text>
      <List display='flex'>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          
        </ListItem>
      </List>
    </Flex>
  );
}
