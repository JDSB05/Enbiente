/* eslint-disable */
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import api from "../../../services/api";
import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useToast } from '../../../components/toasts/toast';
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "../../../layouts/auth/Default.js";
// Assets
import illustration from "../../../assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

function SignIn({ verificarAutenticacao }) {
  // Chakra color mode  
  let history = useHistory();
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setIsLoading] = React.useState(false);
  
  React.useEffect(() => {
    async function checkAuthentication() {
      const token = localStorage.getItem("token");
      const lastPath = sessionStorage.getItem('lastPath');
      if (token) {
        try {
          await verificarAutenticacao();
          const currentHour = new Date().getHours();
          let greeting = "Boa noite"; // Default greeting
          if (currentHour >= 5 && currentHour < 12) {
            greeting = "Bom dia";
          } else if (currentHour >= 12 && currentHour < 18) {
            greeting = "Boa tarde";
          }
          const nome = localStorage.getItem("utilizador_nome");
          showSuccessToast(`${greeting}, ${nome}. Seja bem-vind@!`);
          const cargo = localStorage.getItem("cargo");
          if (cargo === "1") {
            if (lastPath !== "/" && lastPath !== null) {
              history.push(lastPath);
            } else {
              history.push("/admin/dashboard");
            }
          } else if (cargo === "2") {
            if (lastPath !== "/" && lastPath !== null) {
              history.push(lastPath);
            } else {
              history.push("/user/dashboard");
            }
          }
        } catch (error) {
          console.error(error);
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
  
    checkAuthentication();
  }, [verificarAutenticacao, history, showSuccessToast]);

  
  const submit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      showMessageToast("Preencha todos os campos!");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const user = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", user.data.message); // guardar o token no localStorage

      await verificarAutenticacao();
      const currentHour = new Date().getHours();
      let greeting;
      let nome = localStorage.getItem("utilizador_nome");
      if (currentHour >= 5 && currentHour < 12) {
        greeting = "Bom dia";
      } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Boa tarde";
      } else {
        greeting = "Boa noite";
      }
      showSuccessToast(`${greeting}, ${nome}. Seja bem-vind@!`);

      if (cargo === "1") {
        if (lastPath !== "/" && lastPath !== null) {
          history.push(lastPath);
        } else {
          history.push("/admin/dashboard");
        }
      } else if (cargo === "2") {
        if (lastPath !== "/" && lastPath !== null) {
          history.push(lastPath);
        } else {
          history.push("/user/dashboard");
        }
      }
    } catch (err) {
      console.log(err);

      if (err.code === "ERR_NETWORK") {
        showErrorToast("Erro de Conexão");
        setIsLoading(false);
      } else {
        showErrorToast(err.response.data.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Iniciar Sessão
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Introduza o seu email e palavra passe para iniciar sessão!
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <FormControl>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='mail@exemplo.com'
              mb='24px'
              fontWeight='500'
              size='lg'
            />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fontSize='sm'
                placeholder='Insira a sua palavra-passe'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent='space-between' align='center' mb='24px'>
              <NavLink to='/recuperarconta'>
                <Text
                  color={textColorBrand}
                  fontSize='sm'
                  w='124px'
                  fontWeight='500'>
                  Esqueceu a palavra-passe?
                </Text>
              </NavLink>
            </Flex>
            <Button
              isLoading={isLoading}
              onClick={submit}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'>
              Iniciar Sessão
            </Button>
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Ainda não tem uma conta?
              <NavLink to='/registar'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Registar
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
