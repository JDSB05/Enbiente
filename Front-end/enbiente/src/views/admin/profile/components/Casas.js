import {
  Flex, Text, useColorModeValue, Button, Icon, Modal, ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  FormLabel,
  Input,
  Select
} from "@chakra-ui/react";
import Card from "../../../../components/card/Card.js";
import React, { useState, useEffect } from "react";
import Project from "./Casa";
import { MdAdd } from "react-icons/md";
import api from "../../../../services/api";
import { useToast } from '../../../../components/toasts/toast';

export default function Projects(props) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const [casas, setCasas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditar, setIsOpenEditar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const [casa_id, setCasa_id] = useState('');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [precopormetro, setPrecopormetro] = useState('');
  const [tipoCasaValor, setTipoCasaValor] = useState('');
  const [pessoas, setPessoas] = useState('');
  const [tipoCasa, setTipoCasa] = useState([]);
  const [editedFields, setEditedFields] = useState({});
  var numero = 1;
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

    const fetchTiposCasa = async () => {
      try {
        const response = await api.get('/tipocasa');
        setTipoCasa(response.data);
      } catch (error) {
        console.log(error);
        showErrorToast('Erro ao buscar tipos de casa');
      }
    };

    fetchTiposCasa();
    fetchCasas();
  }, []);

  function handleOpenModal() {
    setIsOpen(true);
  }

  function handleCloseModal() {
    setNome('');
    setEndereco('');
    setPrecopormetro('');
    setTipoCasaValor('');
    setPessoas('');
    setIsOpen(false);
  }

  function handleOpenModalEditar(casa) {
    setNome(casa.nome);
    setEndereco(casa.endereco);
    setPrecopormetro(casa.precopormetro);
    setTipoCasaValor(casa.tipo_casa_id.toString());
    setCasa_id(casa.casa_id);
    setPessoas(casa.pessoas.toString());
    setIsOpenEditar(true);
    
  }

  function handleCloseModalEditar() {
    setIsOpenEditar(false);
    setNome('');
    setEndereco('');
    setPrecopormetro('');
    setTipoCasaValor('');
    setPessoas('');
  }

  async function handleFieldChange(field, value) {
      const updatedFields = {
        ...editedFields,
        [field]: value
      };
      setEditedFields(updatedFields);
      console.log("UPDATED FIELDS1")  
      console.log(updatedFields);
  }

  function submit() {
    if (!nome || !endereco || !precopormetro || !tipoCasaValor || !pessoas) {
      showErrorToast('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    const payload = {
      utilizador_id: parseInt(localStorage.getItem("utilizador_id")),
      nome,
      endereco,
      precopormetro: parseFloat(precopormetro),
      tipo_casa_id: parseInt(tipoCasaValor),
      pessoas: parseInt(pessoas),
      data_criacao: new Date(),
      data_ultalteracao: new Date()
    };
    
    api.post('/casas', payload)
      .then(response => {
        console.log(response.data);
        showSuccessToast('Casa criada com sucesso');
        setIsLoading(false);
        handleCloseModal();
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
        showErrorToast('Erro ao criar casa');
        setIsLoading(false);
        handleCloseModal();
      });
  }

  function submitEdits() {
    if (Object.keys(editedFields).length === 0) {
      showMessageToast('Nenhum campo foi editado.');
      return;
    }

    const editedData = { ...editedFields, casa_id: casa_id, data_ultalteracao: new Date() };
    setIsLoading(true);

    api.put(`/casas/${casa_id}`, editedData)
      .then(response => {
        console.log(response.data);
        showSuccessToast('Casa editada com sucesso');
        setIsLoading(false);
        handleCloseModalEditar();
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
        showErrorToast('Erro ao editar casa');
        setIsLoading(false);
        handleCloseModalEditar();
      });
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
              <Icon as={MdAdd} color={textColorPrimary} h='15px' w='15px'
            />
            </Button>
          </Flex>
        </Flex>
        <div style={{ height: '363px', maxHeight: '363px', width: '100%', overflowY: 'auto', scrollbarWidth: 'none', scrollbarColor: '#888 transparent' }}>
          {casas.length === 0 ? (
            <Flex justifyContent='center' alignItems='center' h='100%'>
              <Text color={textColorPrimary} fontWeight='bold' fontSize='2xl' mt='10px' mb='4px'>
                Não existem casas
              </Text>
            </Flex>
          ) : (
            casas.map(casa => (
              <Project
                key={casa.casa_id}
                boxShadow={cardShadow}
                mb='20px'
                nome={casa.nome}
                endereco={casa.endereco}
                precopormetro={casa.precopormetro}
                tipocasa={casa.TipoCasa.tipo_casa}
                casaid={casa.casa_id}
                handleOpenModalEditar={() => handleOpenModalEditar(casa)}
              />
            ))
          )}
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
                isRequired={true}
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
                isRequired={true}
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
                Tipo de casa
              </FormLabel>
              <Select
                placeholder="Selecione o tipo de casa"
                variant="auth"
                border="1px"
                value={tipoCasaValor}
                onChange={(event) => setTipoCasaValor(event.target.value)}
              >
                {tipoCasa.map((tipo, index) => (
                  <option key={tipo.tipo_casa_id} value={tipo.tipo_casa_id}>
                    {tipo.tipo_casa}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
              >
                Pessoas
              </FormLabel>
              <Input
                value={pessoas}
                onChange={(event) => setPessoas(event.target.value)}
                variant='auth'
                fontSize='sm'
                type='number'
                placeholder='Número de pessoas'
                fontWeight='500'
                size='lg'
                isRequired={true}
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
                isRequired={true}
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
      <Modal isOpen={isOpenEditar} size="2xl" onClose={handleCloseModalEditar}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar casa</ModalHeader>
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
                onChange={(event) => {
                  setNome(event.target.value);
                  handleFieldChange("nome", event.target.value);
                }}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='text'
                placeholder='Nome'
                fontWeight='500'
                size='lg'
                isRequired={true}
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
                onChange={(event) => { setEndereco(event.target.value); handleFieldChange("endereco", event.target.value); }}
                variant='auth'
                fontSize='sm'
                type='text'
                placeholder='Rua 1, 1234-567 Lisboa'
                fontWeight='500'
                size='lg'
                isRequired={true}
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
                Tipo de casa
              </FormLabel>
              <Select
                placeholder="Selecione o tipo de casa"
                variant="auth"
                border="1px"
                value={tipoCasaValor}
                onChange={(event) => { setTipoCasaValor(event.target.value); handleFieldChange("tipo_casa_id", event.target.value);}}
              >
                {tipoCasa.map((tipo, index) => (
                  <option key={tipo.tipo_casa_id} value={tipo.tipo_casa_id}>
                    {tipo.tipo_casa}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
              >
                Pessoas
              </FormLabel>
              <Input
                value={pessoas}
                onChange={(event) => { setPessoas(event.target.value); handleFieldChange("pessoas", parseInt(event.target.value));}}
                variant='auth'
                fontSize='sm'
                type='number'
                placeholder='Número de pessoas'
                fontWeight='500'
                size='lg'
                isRequired={true}
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
                onChange={(event) => { setPrecopormetro(event.target.value); handleFieldChange("precopormetro", parseFloat(event.target.value));}}
                variant='auth'
                fontSize='sm'
                type='number'
                placeholder='100'
                fontWeight='500'
                size='lg'
                isRequired={true}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant='brand' mr={3} isLoading={isLoading} onClick={submitEdits}>
              Guardar
            </Button>
            <Button variant="solid" mr={3} onClick={handleCloseModalEditar}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
