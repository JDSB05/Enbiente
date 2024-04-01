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
  Select
} from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/card/Card";
import { AndroidLogo, AppleLogo, WindowsLogo } from "../../../../components/icons/Icons";
import { MdAdd } from "react-icons/md";
import Menu from "../../../../components/menu/MainMenu";
import React, { useMemo, useEffect } from "react";
import  { useToast } from '../../../../components/toasts/toast';
import api from "../../../../services/api";
import MiniCalendar from "components/calendar/MiniCalendar";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

export default function DevelopmentTable(props) {
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const { columnsData, tableData } = props;
  const [casaList, setCasaList] = React.useState([]);
  const [casaValor, setCasaValor] = React.useState("");
  const [dataVolumeConsumido, setDataVolumeConsumido] = React.useState(new Date());
  const [volumeConsumido, setVolumeConsumido] = React.useState("");
  const [editedFields, setEditedFields] = React.useState({});
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  useEffect(() => {
    async function getCasas() {
      try {
        const response = await api.get("/casas?utilizador_id=" + localStorage.getItem("utilizador_id"));
        setCasaList(response.data);
      } catch (error) {
        showErrorToast("Erro ao carregar casas");
      }
    }
    getCasas();
  }, []);

  function handleFieldChange(field, value) {
    setEditedFields({ ...editedFields, [field]: value });
  }

  const tableInstance = useTable(
    {
      columns,
      data,
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
    prepareRow,
    initialState,
  } = tableInstance;

  initialState.pageSize = 11;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("secondaryGray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColorPrimary = useColorModeValue("brand.500", "brand.300");

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  function handleOpenModal() {
    setIsOpen(true);
  };

  function handleCloseModal() {
    setIsOpen(false);
    setCasaValor("");
    setDataVolumeConsumido(new Date());
    setVolumeConsumido("");
  };
  function formatarMes(data) {
    const opcoes = { month: 'long' }; // ou use 'short' para a abreviação do mês
    return new Date(data).toLocaleDateString('pt-BR', opcoes);
  }
  function submit() {
      setIsLoading(true);
      api.post("/consumos", {
        casa_id: casaValor,
        data_consumo: dataVolumeConsumido,
        volume_consumido: volumeConsumido
      }).then(() => {
        showSuccessToast("Consumo criado com sucesso");
        setIsLoading(false);
        handleCloseModal();
        window.location.reload();
      }).catch(() => {
        showErrorToast("Erro ao criar consumo");
        setIsLoading(false);
      });
  }
  return (
    <div>
      <Card
        direction='column'
        w='100%'
        px='0px'
        overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Flex px='25px' justify='space-between' mb='20px' align='center'>
          <Text
            color={textColor}
            fontSize='22px'
            fontWeight='700'
            lineHeight='100%'>
            Consumos
          </Text>
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
                            {cell.row.original['Casa.nome']}
                          </Text>
                        );
                      } else if (cell.column.Header === "Data") {
                        let date = new Date(cell.row.original.data_consumo).toLocaleDateString()
                        data = (
                          <Text color={textColor} fontSize='sm' fontWeight='700'>
                            {date}
                          </Text>
                        );
                      } else if (cell.column.Header === "Eficiência") {
                        data = (
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
            maxDate={new Date()}
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
  return (
    <div>
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Consumos
        </Text>
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
          {page.map((row, index) => {
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
                        {cell.row.original['Casa.nome']}
                      </Text>
                    );
                  } else if (cell.column.Header === "Data") {
                    let date = new Date(cell.row.original.data_consumo).toLocaleString()
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {date}
                      </Text>
                    );
                  } else if (cell.column.Header === "Eficiência") {
                    data = (
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
          })}
        </Tbody>
      </Table>
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
            maxDate={new Date()}
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
