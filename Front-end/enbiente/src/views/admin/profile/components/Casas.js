// Chakra imports
import {
  Flex, Text, useColorModeValue, Button, Icon, Modal, ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  FormLabel,
  Input
} from "@chakra-ui/react";
// Assets
import Project1 from "../../../../assets/img/profile/Project1.png";
import Project2 from "../../../../assets/img/profile/Project2.png";
import Project3 from "../../../../assets/img/profile/Project3.png";
// Custom components
import Card from "../../../../components/card/Card.js";
import React, { useState, useEffect } from "react";
import Project from "./Casa";
import { MdAdd } from "react-icons/md";
import api from "../../../../services/api";
import { useToast } from '../../../../components/toasts/toast';

export default function Projects(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const [casas, setCasas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const [nome, setNome] = useState('');
  const utilizador_id = localStorage.getItem('utilizador_id');
  const [endereco, setEndereco] = useState('');
  const [precopormetro, setPrecopormetro] = useState('');
  const [tipo_casa, setTipoCasa] = useState('');
  const textColor = useColorModeValue("secondaryGray.900", "white");
  useEffect(() => {
    const fetchCasas = async () => {
      try {
        const response = await api.get('/casas');
        setCasas(response.data);
      } catch (error) {
        console.log(error);
        showErrorToast('Erro ao buscar casas');
      }
    };

    fetchCasas();
  }, []);
  function handleOpenModal() {
    setIsOpen(true);
  }
  function handleCloseModal() {
    setIsOpen(false);
  }
  function submit() {
    if (!nome || !endereco || !precopormetro) {
      showErrorToast('Por favor, preencha todos os campos.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      api.post('/casas', { nome, utilizador_id, endereco, precopormetro, tipo_casa: 'Teste', data_criacao: new Date(), data_ultalteracao: new Date() })
        .then(response => {
          console.log(response.data);
          showSuccessToast('Casa criada com sucesso');
          setIsLoading(false);
          handleCloseModal();
          setNome('');
          setEndereco('');
          setPrecopormetro('');
          setTipoCasa('');
          setCasas([...casas, response.data]);// Adiciona a nova casa à lista de casas
        })
        .catch(error => {
          console.log(error);
          showErrorToast('Erro ao criar casa');
          setIsLoading(false);
          handleCloseModal();
        });
    } catch (error) {
      console.log(error);
      showErrorToast('Erro ao criar casa');
      setIsLoading(false);
      handleCloseModal();
    }
  }
  
  return (
    <div>
      <Card mb={{ base: "0px", "2xl": "20px" }}>
        <Flex w='100%' mb='5px'>
          <Flex w='50%' mx='auto' me='60px' align='left' direction='column'>
            <Text
              color={textColorPrimary}
              fontWeight='bold'
              fontSize='2xl'
              mt='10px'
              mb='4px'>
              Casas
            </Text>
          </Flex>
          <Flex w='50%' justifyContent="right" alignItems='center' >
            <Button
              w='auto'
              variant='solid'
              onClick={handleOpenModal}
            >
              <MdAdd size={15} color={textColorPrimary} />
            </Button>
          </Flex>
        </Flex>
        <div style={{ maxHeight: '360px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#888 transparent' }}>
          {casas.map(casa => (
            <Project
              key={casa.casaid}
              boxShadow={cardShadow}
              mb='20px'
              nome={casa.nome}
              endereco={casa.endereco}
              precopormetro={casa.precopormetro}
              tipocasa={casa.tipo_casa}
              casaid={casa.casaid}
            />
          ))}
        </div>
      </Card>
      <Modal isOpen={isOpen} size="2xl" onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar casa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text
              color={textColorPrimary}
              fontWeight='bold'
              fontSize='2xl'
              mt='10px'
              mb='4px'>
              Insira os dados da casa
            </Text>
            <div>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
              >
                Nome
              </FormLabel>
              <Input
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='text'
                placeholder='Nome'
                fontWeight='500'
                size='lg'
                isrequired={true}
              />
            </div>
            <div>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
              >
                Endereço
              </FormLabel>
              <Input
                value={endereco}
                onChange={(event) => setEndereco(event.target.value)}
                variant='auth'
                fontSize='sm'
                type='text'
                placeholder='Rua 1, 1234-567 Lisboa'
                fontWeight='500'
                size='lg'
                isrequired={true}
              />
            </div>
            <div>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
              >
                Preço por metro
              </FormLabel>
              <Input
                value={precopormetro}
                onChange={(event) => setPrecopormetro(event.target.value)}
                variant='auth'
                fontSize='sm'
                type='number'
                placeholder='100'
                fontWeight='500'
                size='lg'
                isrequired={true}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant='brand' mr={3} isLoading={isLoading} onClick={submit}>
              Criar
            </Button>
            <Button variant="solid" mr={3} onClick={handleCloseModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
