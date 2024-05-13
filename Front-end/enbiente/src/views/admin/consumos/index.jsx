
// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "./components/Consumos";

import React, {useEffect} from "react";
import api from "../../../services/api"
import { useToast } from '../../../components/toasts/toast';
import { useUser } from '../../../UserProvider';
export default function Settings() {
  const [consumos, setConsumos] = React.useState([]);
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const { updateComponent } = useUser();
  const columnsDataDevelopment = [
    {
      Header: "Mês",
      accessor: "data_consumo",
    },
    {
      Header: "Casa",
      accessor: "Casa.nome",
    },
    {
      Header: "Data",
      accessor: "dataconsumo",
    },
    {
      Header: "Consumo",
      accessor: "volume_consumido",
    },
    {
      Header: "Eficiência",
      accessor: "eficiencia",
    },
  ];
  useEffect(() => {
    async function getConsumos() {
      let currentPath = window.location.href;
      currentPath = currentPath.split('#')[1];
      sessionStorage.setItem('lastPath', currentPath);
      try {
        const response = await api.get("/consumos?utilizador_id=" + localStorage.getItem("utilizador_id"));
        response.data.sort((a, b) => new Date(b.data_consumo) - new Date(a.data_consumo));
        setConsumos(response.data);
        console.log(response.data)
      } catch (error) {
        showErrorToast("Erro ao carregar consumos");
      } finally {
        setIsLoadingData(false);
      }
    }
      getConsumos();
  }, [updateComponent]);
  if (isLoadingData)
  return (<Box pl={{ base: "45%", md: "45%", xl: "45%" }} pt={{ base: "45%", md: "45%", xl: "25%" }}><div className="loader"></div></Box>)
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={consumos}
        />  
      </SimpleGrid>
    </Box>
  );
}
