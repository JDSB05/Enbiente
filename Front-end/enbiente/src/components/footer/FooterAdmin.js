/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  const textColor = useColorModeValue("gray.400", "white");
  const { toggleColorMode } = useColorMode();
  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px={{ base: "30px", md: "50px" }}
      pb='30px'>
      <Text
        color={textColor}
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}>
        {" "}
        &copy; {1900 + new Date().getYear()}
        <Text as='span' fontWeight='500' ms='4px'>
          Hydro Check. Todos os direitos reservados. Plataforma feita para
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
      </Text>
      <List display='flex'>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            marginLeft={{ base: "0px", lg: "20px" }}
            fontWeight='500'
            color={textColor}
            href='mailto:geral@enbiente.com?subject=Plataforma Hydro Check'>
            Suporte
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}
