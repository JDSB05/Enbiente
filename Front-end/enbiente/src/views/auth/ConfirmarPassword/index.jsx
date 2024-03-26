// Chakra imports
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    useColorModeValue,
    Text,
    InputGroup,
    InputRightElement,
    Icon,
  } from '@chakra-ui/react';
  
  // Custom components
  import DefaultAuth from 'layouts/auth/Default';
  
  // Assets
  import illustration from 'assets/img/auth/auth.png';
  import api from '../../../services/api';
  import { useToast } from '../../../components/toasts/toast';
  import React, { useState } from 'react';
  import { useHistory } from "react-router-dom";
  import { MdOutlineRemoveRedEye } from 'react-icons/md';
  import { RiEyeCloseLine } from "react-icons/ri";
  function ConfirmPassword() {
    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';
    const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
    const brandStars = useColorModeValue('brand.500', 'brand.400');
    const [email, setEmail] = useState('');
    const {showMessageToast, showErrorToast, showSuccessToast } = useToast();
    const history = useHistory();
    const [show, setShow] = React.useState(false);
    const [show2, setShow2] = React.useState(false);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const code = urlParams.get('resetpassword');
    const handleClick = () => setShow(!show);
    const handleClick2 = () => setShow2(!show2);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitting(true);
        if(!code) {
          alert('Falta o código')
          setSubmitting(false);
          return
        }
        if (errorMessage) {
          showErrorToast("A palavra-passe não cumpre as regras.") 
          setSubmitting(false);
          return;
        }
        if (password === passwordConfirm) {
    
          api.post(`/auth/resetpassword?code=${code}` , {password: password}).then(() => {
            showSuccessToast("Palavra-passe redefinida com sucesso!")
            setSubmitting(false);
            history.push("/login");
    
          }).catch(err => {        
            showErrorToast(err.response.data.message);
            setSubmitting(false);
          })
        } else {
          showErrorToast('As palavras-passes não são iguais, tente novamente.');
          setSubmitting(false);
        }
       
      }
      const validatePassword = (value) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[^\s]{6,}$/;
    
        if (!value) {
          setErrorMessage("");
        } else if (!regex.test(value)) {
          setErrorMessage("A palavra-passe deve conter pelo menos uma letra maiúscula ou minúscula, um número e ter um comprimento mínimo de 6 caracteres, sem permitir espaços em branco.");
        } else {
          setErrorMessage("");
        }
      };
      const handleChangePassword = (event) => {
        const { value } = event.target;
        setPassword(value);
        validatePassword(value);
      };
        const handleChangePasswordConfirm = (event) => {
            const { value } = event.target;
            setPasswordConfirm(value);
            validatePassword(value);
        };
    return (
      <DefaultAuth illustrationBackground={illustration} image={illustration}>
        <Flex
          w="100%"
          maxW="max-content"
          mx={{ base: 'auto', lg: '0px' }}
          me="auto"
          h="100%"
          alignItems="start"
          justifyContent="center"
          mb={{ base: '30px', md: '60px', lg: '100px', xl: '60px' }}
          px={{ base: '25px', md: '0px' }}
          mt={{ base: '40px', lg: '16vh', xl: '22vh' }}
          flexDirection="column"
        >
          <Box me="auto" mb="34px">
            <Heading
              color={textColor}
              fontSize={{ base: '3xl', md: '36px' }}
              mb="16px"
            >
              Introduzir palavra-passe
            </Heading>
            <Text
              color={textColorSecondary}
              fontSize="md"
              w={{ base: '100%', lg: '456px' }}
              maxW="100%"
            >
                Introduza a sua palavra-passe para recuperar a sua conta
            </Text>
          </Box>
          <Flex
            zIndex="2"
            direction="column"
            w={{ base: '100%', lg: '456px' }}
            maxW="100%"
            background="transparent"
            borderRadius="15px"
            mx={{ base: 'auto', lg: 'unset' }}
            me="auto"
            mb={{ base: '20px', md: 'auto' }}
            align="start"
          >
            <FormControl>
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Palavra-Passe
            </FormLabel>
            <InputGroup size='md'>
              <Input
                value={password}
                onChange={handleChangePassword}
                fontSize='sm'
                placeholder='Minimo 8 caracteres'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
                isrequired={true}
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
            <Text color={textColorDetails} fontWeight='400' fontSize='13px'>
              {errorMessage && <div className="text-danger">{errorMessage}</div>}
            </Text>
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Confirmar palavra-Passe
            </FormLabel>
            <InputGroup size='md'>
              <Input
                value={passwordConfirm}
                onChange={handleChangePasswordConfirm}
                fontSize='sm'
                placeholder='Minimo 8 caracteres'
                mb='24px'
                size='lg'
                type={show2 ? "text" : "password"}
                variant='auth'
                isrequired={true}
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show2 ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick2}
                />
              </InputRightElement>
            </InputGroup>
            <Button
              onClick={handleSubmit}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              isLoading={submitting}> 
              Mudar palavra-passe
            </Button>
          </FormControl>
          </Flex>
        </Flex>
      </DefaultAuth>
    );
  }
  
  export default ConfirmPassword;
  