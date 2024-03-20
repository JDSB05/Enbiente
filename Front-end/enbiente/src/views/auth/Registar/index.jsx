import React, { useState } from "react";
import illustration from "../../../assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import { Modal } from "react-bootstrap";
import { useToast } from '../../../components/toasts/toast';
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
import DefaultAuth from "layouts/auth/Default.js";

function Registar() {
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [genero, setGenero] = useState("");
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const [show, setShow] = React.useState(false);
  
  const handleClick = () => setShow(!show);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (submitting) {
      console.log("Ainda a enviar");
      showMessageToast("Ainda a enviar! O seu pedido está a ser processado.");
      return;
    }

    setSubmitting(true);

  
    if (password !== passwordConfirm) {
      showErrorToast("As palavras-passe não são iguais. Tente novamente.");
      setSubmitting(false);
      return;
    }
    if (!name || !email || !password || !passwordConfirm ) {
      showErrorToast("Preencha todos os campos.");
      setSubmitting(false);
      return;
    }
  
    if (errorMessage) {
      showErrorToast("A palavra-passe não cumpre as regras.");
      setSubmitting(false);
      return;
    }
  
    api.post("/utilizador", {
        nome: name,
        email: email,
        password: password,
        cargo_id: 1,
        tipo_cliente_id: 1,
        estado: "inativo",
        telemovel: "123456789"
      })
      .then((user) => {
        showSuccessToast("Registo feito com sucesso!");
        history.push("/login");
      })
      .catch((err) => {
        console.log(err);  
        setSubmitting(false);
      });
  };

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


  const handleModalClose = () => {
    setShowModal(false);
    history.push("/login");
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
            Registar
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Introduza o seu email e palavra passe para criar uma conta
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
              Nome
            </FormLabel>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='text'
              placeholder='Nome'
              mb='24px'
              fontWeight='500'
              size='lg'
              isrequired
            />
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email
            </FormLabel>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              isRequired={true}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='mail@exemplo.com'
              mb='24px'
              fontWeight='500'
              size='lg'
              isrequired
            />
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
                isrequired
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
                type={show ? "text" : "password"}
                variant='auth'
                isrequired
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
            {/* Other fields */}
            <Button
              onClick={handleSubmit}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'>
              Criar conta
            </Button>
          </FormControl>
        </Flex>
      </Flex>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registo feito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Verifique a conta, acedendo ao link que foi enviado para: {email}</p>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </DefaultAuth>
  );
}

export default Registar;

