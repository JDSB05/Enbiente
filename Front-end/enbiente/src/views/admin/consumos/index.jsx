/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "./components/Consumos";
import CheckTable from "../../../views/admin/consumos/components/CheckTable";
import ColumnsTable from "../../../views/admin/consumos/components/ColumnsTable";
import ComplexTable from "../../../views/admin/consumos/components/ComplexTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "../../../views/admin/consumos/variables/columnsData";
import tableDataDevelopment from "../../../views/admin/consumos/variables/tableDataDevelopment.json";
import tableDataCheck from "../../../views/admin/consumos/variables/tableDataCheck.json";
import tableDataColumns from "../../../views/admin/consumos/variables/tableDataColumns.json";
import tableDataComplex from "../../../views/admin/consumos/variables/tableDataComplex.json";
import React, {useEffect} from "react";
import "../../../index.css";
import api from "../../../services/api"
import { useToast } from '../../../components/toasts/toast';
export default function Settings() {
  const [consumos, setConsumos] = React.useState([]);
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  useEffect(() => {
    async function getConsumos() {
      try {
        const response = await api.get("/consumos?utilizador_id=" + localStorage.getItem("utilizador_id"));
        setConsumos(response.data);
        console.log(response.data)
      } catch (error) {
        showErrorToast("Erro ao carregar consumos");
      } finally {
        setIsLoadingData(false);
      }
    }

    if (consumos.length === 0) {
      getConsumos();
    }
  }, []);
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
