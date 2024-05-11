import {
    Avatar,
    Button,
    Flex,
    Icon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Switch,
    useColorMode,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormLabel,
    Input,
    Select,

  } from "@chakra-ui/react";
  import api from "../../../../services/api";
  import { SearchBar } from "components/navbar/searchBar/SearchBar";
  import React, { useMemo, useState, useEffect } from "react";
  import { MdChevronRight, MdChevronLeft, MdOutlineModeEdit } from "react-icons/md";
  import { useToast } from '../../../../components/toasts/toast';
  import { useUser } from '../../../../UserProvider.js';
  import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
  } from "react-table";
  function SearchTable2(props) {
    const { columnsData, tableData } = props;
    const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState("");
    const [telemovel, setTelemovel] = useState("");
    const [tipo_clientelist, setTipoClientelist] = useState([]);
    const [cargoList, setCargoList] = useState([]);
    const [editedFields, setEditedFields] = useState({});
    const [utilizador_id, setUtilizador_id] = useState("");
    const [cargoValor, setCargoValor] = useState("");
    const [tipoClienteValor, setTipoClienteValor] = useState("");
    const { updateUserComponent } = useUser();
    useEffect(() => {
      const fetchData = async () => {
        try {
          let response = await api.get("/tipoclientes");
          setTipoClientelist(response.data);
          response = await api.get("/cargos");
          setCargoList(response.data);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };
  
      fetchData();
    }, []);
    async function handleOpenModal(utilizador_id) {
      try {
        const response = await api.get(`/utilizador/${utilizador_id}`);
        const data = response.data;
        setUtilizador_id(utilizador_id);
        setNome(data.nome);
        setTelemovel(data.telemovel);
        setCargoValor(data.cargo_id);
        setTipoClienteValor(data.tipo_cliente_id);
        setEditedFields({});
      } catch (error) { 
        console.error("Error fetching data", error);
        showErrorToast('Erro ao carregar utilizador');
      }
      setIsOpen(true);
    }
    function handleCloseModal() {
      setIsOpen(false);
      setNome("");
      setTelemovel("");
      setCargoValor("");
      setTipoClienteValor("");
      setEditedFields({});
    }
    function handleFieldChange(field, value) {
      const updatedFields = {
        ...editedFields,
        [field]: value,
      };
      setEditedFields(updatedFields);
    }
   async function submitEdits() {
    if (Object.keys(editedFields).length === 0) {
      showMessageToast('Nenhum campo foi editado.');
      return;
    }

    const editedData = { ...editedFields};
    console.log(editedData);
    setIsLoading(true);

    await api.put(`/utilizador/${utilizador_id}`, editedData)
      .then(response => {
        console.log(response.data);
        showSuccessToast('Utilizador editado com sucesso');
        setIsLoading(false);
        handleCloseModal();
        updateUserComponent();
      })
      .catch(error => {
        console.log(error);
        showErrorToast('Erro ao editar utilizador');
        setIsLoading(false);
        handleCloseModal();
      });
  }
    const tableInstance = useTable(
      {
        columns,
        data,
        initialState: { pageSize: 10 },
      },
      useGlobalFilter,
      useSortBy,
      usePagination
    );  

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      gotoPage,
      pageCount,
      prepareRow,
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      setGlobalFilter,
      state,
    } = tableInstance;
    const createPages = (count) => {
      let arrPageCount = [];
  
      for (let i = 1; i <= count; i++) {
        arrPageCount.push(i);
      }
  
      return arrPageCount;
    };
  
    const { pageIndex, pageSize } = state;
    const textColorPrimary = useColorModeValue("navy.700", "white");
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const brandColor = useColorModeValue("brand.500", "brand.400");
    return (
      <>
        <Flex
          direction='column'
          w='100%'
          minW='100%'
          overflowX='auto'>
          <Flex
            align={{ sm: "flex-start", lg: "flex-start" }}
            justify={{ sm: "flex-start", lg: "flex-start" }}
            w='100%'
            px='22px'
            mb='36px'>
            <SearchBar
              onChange={(e) => setGlobalFilter(e.target.value)}
              h='44px'
              w={{ lg: "390px" }}
              borderRadius='16px'
            />
          </Flex>
          <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
            <Thead>
              {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      pe='10px'
                      key={index}
                      borderColor={borderColor}>
                      <Flex
                        justify='center'
                        align='center'
                        fontSize={{ sm: "10px", lg: "12px" }}
                        color='gray.400'>
                        {column.render("Header")}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
            {page.length ? ( // Verifica se há dados na página
              page.map((row, index) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => {
                      let data = "";
                      if (cell.column.Header === "Foto" ) {
                        let nome = cell.row.original.nome;
                        data = (
                          <Flex align='center'>
                            <Avatar
                              src={cell.value ? cell.value : "N/A"}
                              name={nome ? nome : "N/A"}
                              h='60px'
                              w='60px'
                              me='10px'
                            />
                          </Flex>
                        );}
                       else if (cell.column.Header === "Nome" ) {
                        data = (
                          <Flex align='center'>
                            <Text
                              color={textColor}
                              fontSize='md'
                              fontWeight='500'>
                              {cell.value ? cell.value : "N/A"}
                            </Text>
                          </Flex>
                        );
                      } else if (cell.column.Header === "Email") {
                        data = (
                          <Text color={textColor} fontSize='md' fontWeight='500'>
                            {cell.value ? cell.value : "N/A"}
                          </Text>
                        );
                      } else if (cell.column.Header === "Telemovel") {
                        data = (
                          <Text color={textColor} fontSize='md' fontWeight='500'>
                            {cell.value ? cell.value : "N/A"}
                          </Text>
                        );
                      } else if (cell.column.Header === "Ultimo Login") {
                        let date = cell.value ? new Date(cell.value).toLocaleString() : "Nunca";
                        data = (
                          <Text color={textColor} fontSize='md' fontWeight='500'>
                            {date}
                          </Text>
                        );
                      } else if (cell.column.Header === "Estado") {
                        let novoEstado = cell.value === 0 ? 1 : 0; // Use let instead of const
                        data = (
                          <Flex >
                            <Switch
                              w='auto'
                              variant="main"
                              colorScheme="brandScheme"
                              size="md"
                              id={cell.row.original.utilizador_id}
                              isChecked={cell.value === 0 ? false : true}
                              onChange={async () => {
                                novoEstado = cell.value === 0 ? 1 : 0; // Update novoEstado value
                                try {
                                  await api.put(`auth/disableuser/${cell.row.original.utilizador_id}`, { estado: novoEstado }).then(() => {
                                  updateUserComponent();
                                  });
                                } catch (error) {
                                  console.error("Error fetching data", error);
                                  showErrorToast(error.response.status == 403 ? error.response.data.message : 'Erro ao desativar utilizador');
                                }
                              }}
                            />
                            <Text color={textColor} fontSize='sm' fontWeight='500'>
                              {novoEstado === 0 ? "Desativar conta" : "Ativar conta" }
                            </Text>
                          </Flex>
                        );
                      }
                       else if (cell.column.Header === "") {
                        data = (
                          <Button
                            cursor='pointer'
                            variant='brand'
                            color={textColor}
                            fontSize='md'
                            fontWeight='500'
                            onClick={() => handleOpenModal(cell.row.original.utilizador_id)}>
                            <Icon color={'white'} as={MdOutlineModeEdit} h='20px' w='20px'/>
                          </Button>
                        );
                      }
                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor={borderColor}>
                          {data}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td colSpan={headerGroups[0].headers.length} textAlign="center">
                  Não existem utlizadores
                </Td>
              </Tr>
            )}
            </Tbody>
          </Table>
          <Flex
            direction={{ sm: "column", md: "row" }}
            justify='space-between'
            align='center'
            w='100%'
            px={{ md: "22px" }}>
            <Text
              fontSize='sm'
              color='gray.500'
              fontWeight='normal'
              mb={{ sm: "24px", md: "0px" }}>
              A mostrar do {pageSize * pageIndex + 1} até {" "}
              {pageSize * (pageIndex + 1) <= tableData.length
                ? pageSize * (pageIndex + 1)
                : tableData.length},{" "}
              de {tableData.length} utilizadores
            </Text>
            <Stack direction='row' alignSelf='flex-end' spacing='4px' ms='auto'>
              <Button
                variant='no-effects'
                onClick={() => previousPage()}
                transition='all .5s ease'
                w='40px'
                h='40px'
                borderRadius='50%'
                bg='transparent'
                border='1px solid'
                borderColor={useColorModeValue("gray.200", "white")}
                display={
                  pageSize === 5 ? "none" : canPreviousPage ? "flex" : "none"
                }
                _hover={{
                  bg: "whiteAlpha.100",
                  opacity: "0.7",
                }}>
                <Icon as={MdChevronLeft} w='16px' h='16px' color={textColorPrimary} />
              </Button>
              {pageSize === 5 ? (
                <NumberInput
                  max={pageCount - 1}
                  min={1}
                  w='75px'
                  mx='6px'
                  defaultValue='1'
                  onChange={(e) => gotoPage(e)}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper onClick={() => nextPage()} />
                    <NumberDecrementStepper onClick={() => previousPage()} />
                  </NumberInputStepper>
                </NumberInput>
              ) : (
                createPages(pageCount).map((pageNumber, index) => {
                  return (
                    <Button
                      variant='no-effects'
                      transition='all .5s ease'
                      onClick={() => gotoPage(pageNumber - 1)}
                      w='40px'
                      h='40px'
                      borderRadius='50%'
                      bg={
                        pageNumber === pageIndex + 1 ? brandColor : "transparent"
                      }
                      border={
                        pageNumber === pageIndex + 1
                          ? "none"
                          : "1px solid lightgray"
                      }
                      _hover={
                        pageNumber === pageIndex + 1
                          ? {
                              opacity: "0.7",
                            }
                          : {
                              bg: "whiteAlpha.100",
                            }
                      }
                      key={index}>
                      <Text
                        fontSize='sm'
                        color={pageNumber === pageIndex + 1 ? "#fff" : textColor}>
                        {pageNumber}
                      </Text>
                    </Button>
                  );
                })
              )}
              <Button
                variant='no-effects'
                onClick={() => nextPage()}
                transition='all .5s ease'
                w='40px'
                h='40px'
                borderRadius='50%'
                bg='transparent'
                border='1px solid'
                borderColor={useColorModeValue("gray.200", "white")}
                display={pageSize === 5 ? "none" : canNextPage ? "flex" : "none"}
                _hover={{
                  bg: "whiteAlpha.100",
                  opacity: "0.7",
                }}>
                <Icon as={MdChevronRight} w='16px' h='16px' color={textColor} />
              </Button>
            </Stack>
          </Flex>
        </Flex>
        <Modal isOpen={isOpen} size="2xl" onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar utilizador</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text
              color={textColorPrimary}
              fontWeight='bold'
              fontSize='2xl'
              mt='10px'
              mb='4px'>
              Modifique os dados do utilizador
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
                marginBottom='1%'
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
                Cargo
              </FormLabel>
              <Select
                placeholder="Selecione o cargo"
                variant="auth"
                border="1px"
                value={cargoValor}
                marginBottom='1%'
                onChange={(event) => { setCargoValor(event.target.value); handleFieldChange("cargo_id", event.target.value);}}
              >
                {cargoList.map((tipo, index) => (
                  <option key={tipo.cargo_id} value={tipo.cargo_id}>
                    {tipo.cargo}
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
                Tipo de cliente
              </FormLabel>
              <Select
                placeholder="Selecione o tipo de cliente"
                variant="auth"
                border="1px"
                marginBottom='1%'
                value={tipoClienteValor}
                onChange={(event) => { setTipoClienteValor(event.target.value); handleFieldChange("tipo_cliente_id", event.target.value);}}
              >
                {tipo_clientelist.map((tipo, index) => (
                  <option key={tipo.tipo_cliente_id} value={tipo.tipo_cliente_id}>
                    {tipo.tipo_cliente}
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
                Telemovel
              </FormLabel>
              <Input
                value={telemovel}
                onChange={(event) => { setTelemovel(event.target.value.toString()); handleFieldChange("telemovel", event.target.value.toString());}}
                variant='auth'
                fontSize='sm'
                type='number'
                placeholder='Número de telemovel'
                fontWeight='500'
                size='lg'
                isRequired={true}
                marginBottom='1%'
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant='brand' mr={3} isLoading={isLoading} onClick={submitEdits}>
              Guardar
            </Button>
            <Button variant="solid" mr={3} onClick={handleCloseModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
    );
  }
  
  export default SearchTable2;
  