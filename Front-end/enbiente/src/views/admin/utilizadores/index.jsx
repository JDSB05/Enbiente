

// Chakra imports
import { Flex, Box } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, {useEffect} from "react";
import SearchTableUsers from "./components/SearchTableUsersOverview";
import { columnsDataUsersOverview } from "./variables/ColumnsDataUserOverview";
import api from "../../../services/api";
import { useToast } from '../../../components/toasts/toast';
export default function UsersOverview() {
  const [users, setUsers] = React.useState([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await api.get("/utilizador");
        setUsers(response.data);
      } catch (error) {
        showErrorToast("Erro ao carregar utilizadores");
      } finally {
        setIsLoadingData(false);
      }
    }

    if (users.length === 0) {
      getUsers();
    }
  }, []);
  if (isLoadingData)
  return (<Box pl={{ base: "45%", md: "45%", xl: "45%" }} pt={{ base: "45%", md: "45%", xl: "25%" }}><div className="loader"></div></Box>)
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
