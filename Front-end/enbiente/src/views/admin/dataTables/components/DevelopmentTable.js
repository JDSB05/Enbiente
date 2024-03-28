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
} from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/card/Card";
import { AndroidLogo, AppleLogo, WindowsLogo } from "../../../../components/icons/Icons";
import { MdAdd } from "react-icons/md";
import Menu from "../../../../components/menu/MainMenu";
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

export default function DevelopmentTable(props) {
  const { columnsData, tableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

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
  };
  function submit() {
    setIsOpen(false);
    
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
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.Header === "Mês") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
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
                        {cell.value}
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
    <Modal isOpen={isOpen} size="2xl" onClose={handleCloseModal}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Criar consumo</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        Codigo para criar consumo
        {/* 
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
            Casa
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
  </Modal><Modal isOpen={isOpen} size="2xl" onClose={handleCloseModal}>
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
            </div>*/}
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
