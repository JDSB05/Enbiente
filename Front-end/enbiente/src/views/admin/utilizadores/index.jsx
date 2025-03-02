import { Flex, Box } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useEffect, useState } from "react";
import SearchTableUsers from "./components/SearchTableUsersOverview";
import api from "../../../services/api";
import { useToast } from '../../../components/toasts/toast';
import { useUser } from '../../../UserProvider'; // Importe o hook useUser

export default function UsersOverview() {
  const [users, setUsers] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const { updateComponent } = useUser(); // Use o hook useUser para acessar a variável updateComponent
  const columnsDataUsersOverview = [
    {
      Header: "Foto",
      accessor: "foto",
    },
    {
      Header: "Nome",
      accessor: "nome",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Telemovel",
      accessor: "telemovel",
    },
    {
      Header: "Ultimo Login",
      accessor: "ultimoLogin",
    },
    {
      Header: "Estado",
      accessor: "estado",
    },
    {
      Header: "",
      accessor: "a",
    },
  ];
  useEffect(() => {
    async function getUsers() {
      let currentPath = window.location.href;
      currentPath = currentPath.split('#')[1];
      sessionStorage.setItem('lastPath', currentPath);
      try {
        const response = await api.get("/utilizador");
        setUsers(response.data);
      } catch (error) {
        showErrorToast("Erro ao carregar utilizadores");
      } finally {
        setIsLoadingData(false);
      }
    }

    getUsers();
  }, [updateComponent]); // Adicione updateComponent como uma dependência do useEffect

  if (isLoadingData)
    return (
      <Box pl={{ base: "45%", md: "45%", xl: "45%" }} pt={{ base: "45%", md: "45%", xl: "25%" }}>
        <div className="loader"></div>
      </Box>
    );
  
  return (
    <Flex direction='column' pt={{ sm: "125px", lg: "75px" }}>
      <Card px='0px'>
        <SearchTableUsers
          tableData={users}
          columnsData={columnsDataUsersOverview}
        />
      </Card>
    </Flex>
  );
}