/* eslint-disable */
import {
  Flex,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Icon,
  Button,
  Modal,
  ModalOverlay,
  FormLabel,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Select, 
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/card/Card";
import { MdAdd } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import MainMenu from "../../../../components/menu/MainMenu";
import React, { useMemo, useEffect } from "react";
import  { useToast } from '../../../../components/toasts/toast';
import api from "../../../../services/api";
import MiniCalendar from "components/calendar/MiniCalendar";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { useUser } from "../../../../UserProvider";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { CardMenu } from "../../../../components/card/Card";
import moment from "moment";

export default function DevelopmentTable(props) {
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const { columnsData, tableData } = props;
  const [casaList, setCasaList] = React.useState([]);
  const [casaValor, setCasaValor] = React.useState("");
  const [dataVolumeConsumido, setDataVolumeConsumido] = React.useState(moment().toDate());
  const [volumeConsumido, setVolumeConsumido] = React.useState("");
  const [editedFields, setEditedFields] = React.useState({});
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const { updateComponent, updateUserComponent } = useUser();
  useEffect(() => {
    async function getCasas() {
      try {
        const response = await api.get('/casas?utilizador=' + localStorage.getItem('utilizador_id'));
        setCasaList(response.data);
      } catch (error) {
        showErrorToast("Erro ao carregar casas");
      }
    }
    getCasas();
  }, [updateComponent]);

  function handleFieldChange(field, value) {
    setEditedFields({ ...editedFields, [field]: value });
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

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("secondaryGray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColorPrimary = useColorModeValue("brand.500", "brand.300");
  const brandColor = useColorModeValue("brand.500", "brand.400");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pesquisa, setPesquisa] = React.useState("");
  const { pageIndex, pageSize } = state;
  function handleOpenModal() {
    setIsOpen(true);
  };

  function handleCloseModal() {
    setIsOpen(false);
    setCasaValor("");
    setDataVolumeConsumido(new Date());
    setVolumeConsumido("");
    setIsLoading(false);
  };
  function formatarMes(data) {
    const opcoes = { month: 'long' }; // ou use 'short' para a abreviação do mês
    return new Date(data).toLocaleDateString('pt-PT', opcoes);
  }
  async function submit() {
      setIsLoading(true);
      if (!casaValor || !dataVolumeConsumido || !volumeConsumido) {
        showErrorToast("Preencha todos os campos");
        setIsLoading(false);
        return;
      }
      if (volumeConsumido < 0  || volumeConsumido == 0 ) {
        showErrorToast("Verifique o volume consumido");
        setIsLoading(false);
        return;
      }
    try {
      await api.post("/consumos", {
        casa_id: casaValor,
        data_consumo: dataVolumeConsumido,
        volume_consumido: volumeConsumido
      })
      showSuccessToast("Consumo criado com sucesso");
      setIsLoading(false);
      handleCloseModal();
      updateUserComponent();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        showErrorToast("O valor do consumo que introduziu tem que ser maior do que o último valor de consumo da mesma casa! Verifique os valores inseridos e tente novamente.");
      } else {
        showErrorToast("Erro ao criar consumo");
      }
      setIsLoading(false);
    }
  }
  return (
    <div>
      <Card
        position='default'
        w='100%'
        px='0px'
        overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Flex px='25px' justify='space-between' mb='20px' align='center'>
          <Flex alignItems='center' w='50%' justifyContent='left'> 
            <SearchBar
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                setPesquisa(e.target.value);
              }}
              h='44px'
              setPesquisa={setPesquisa}
              setGlobal={setGlobalFilter}
              w={{ lg: "390px" }}
              borderRadius='16px'
            /> 
            <MainMenu ml='10px' icon={CiCalendarDate} setGlobal={setGlobalFilter} setPesquisa={setPesquisa}/>
          </Flex>
          <Flex w='50%' justifyContent="right" alignItems='center' >
              <Button
                w='auto'
                variant='solid'
                onClick={handleOpenModal}
              >
                <Icon as={MdAdd} color={textColor} h='15px' w='15px'
              />
              </Button>
            </Flex>
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
                      justify='space-between'
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
                      if (cell.column.Header === "Mês") {
                        data = (
                          <Text color={textColor} fontSize='sm' fontWeight='700'>
                            {formatarMes(cell.value)}
                          </Text>
                        );
                      } else if (cell.column.Header === "Casa") {
                        data = (
                          <Text color={textColor} fontSize='sm' fontWeight='700'>
                            {cell.value}
                          </Text>
                        );
                      } else if (cell.column.Header === "Data") {

                        data = (
                          <Text color={textColor} fontSize='sm' fontWeight='700'>
                            {moment(cell.value).format("DD/MM/YYYY")}
                          </Text>
                        );
                      } else if (cell.column.Header === "Consumo") {
                        data = (
                          <Text color={textColor} fontSize='sm' fontWeight='700'>
                            {cell.value + " m³"}
                          </Text>
                        );
                      } else if (cell.column.Header === "Eficiência") {
                        data = cell.value === 0.0 ? (
                          <Text color={textColor} fontSize='sm' fontWeight='700'>
                          Sem dados suficientes
                          </Text>
                        ) : (
                          <Flex align='center'>
                          <Text
                            me='10px'
                            color={textColor}
                            fontSize='sm'
                            fontWeight='700'>
                            {cell.value}%
                          </Text>
                          <Progress
                            variant='table'
                            colorScheme='brandScheme'
                            h='8px'
                            w='63px'
                            value={cell.value}
                          />
                          </Flex>
                        );
                      }
                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor='transparent'>
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
                  Não existem consumos
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
              de {tableData.length} consumos
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
                <Icon as={MdChevronLeft} w='16px' h='16px' color={textColor} />
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
      </Card>
      <Modal isOpen={isOpen} size="xl" onClose={handleCloseModal} >
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Criar consumo</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text
          color={textColor}
          fontWeight='bold'
          fontSize='2xl'
          mt='10px'
          mb='4px'>
          Insira os dados do consumo
        </Text>
        <div>
          <FormLabel
            display='flex'
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
          >
            Casa
          </FormLabel>
          <Select
                placeholder="Selecione a casa"
                variant="auth"
                border="1px"
                value={casaValor}
                marginBottom='1%'
                onChange={(event) => { setCasaValor(event.target.value); handleFieldChange("casa_id", event.target.value);}}
              >
                {casaList.map((casa, index) => (
                  <option key={casa.casa_id} value={casa.casa_id}>
                    {casa.nome}, {casa.endereco}
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
            Data do consumo
          </FormLabel>
          <MiniCalendar
            selectRange={false}
            onChange={(value, event) => setDataVolumeConsumido(value)}
            value={dataVolumeConsumido}
            justifyContent="center"
            isRequired={true}
            maxDate={moment().toDate()}
            mb='5px'
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
            Volume consumido (m³)
          </FormLabel>
          <Input
            value={volumeConsumido}
            onChange={(event) => setVolumeConsumido(event.target.value)}
            variant='auth'
            fontSize='sm'
            type='number'
            placeholder='12.1'
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
    </div>
  );
}
