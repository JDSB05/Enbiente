

// Chakra imports
import { Flex } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, {useEffect} from "react";
import SearchTableUsers from "./components/SearchTableUsersOverview";
import { columnsDataUsersOverview } from "./variables/ColumnsDataUserOverview";
import api from "../../../services/api";
import { useToast } from '../../../components/toasts/toast';
export default function UsersOverview() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();

  useEffect(() => {
    async function getUsers() {
      setLoading(true);
      try {
        const response = await api.get("/utilizador");
        setUsers(response.data);
      } catch (error) {
        showErrorToast("Erro ao carregar utilizadores");
      } finally {
        setLoading(false);
      }
    }

    if (users.length === 0) {
      getUsers();
    }
  }, []);
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
