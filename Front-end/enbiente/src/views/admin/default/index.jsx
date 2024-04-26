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
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
// Custom components
import MiniCalendar from "../../../components/calendar/MiniCalendar";
import MiniStatistics from "../../../components/card/MiniStatistics";
import IconBox from "../../../components/icons/IconBox";
import React from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";

import CheckTable from "../../../views/admin/default/components/CheckTable";
import ComplexTable from "../../../views/admin/default/components/ComplexTable";
import DailyTraffic from "../../../views/admin/default/components/DailyTraffic";
import PieCard from "../../../views/admin/default/components/PieCard";
import Tasks from "../../../views/admin/default/components/Tasks";
import TotalSpent from "../../../views/admin/default/components/TotalSpent";
import WeeklyRevenue from "../../../views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "../../../views/admin/default/variables/columnsData";
import tableDataCheck from "../../../views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "../../../views/admin/default/variables/tableDataComplex.json";

import { useEffect, useState } from "react";
import api from '../../../services/api';

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [dadosMensuais, setDadosMensuais] = useState([]); 
  const [consumidoNesteMes, setConsumidoNesteMes] = useState(0.0);
  const [poupadoeuros, setPoupadoeuros] = useState(0.0);
  const [valorMesAtual, setValorMesAtual] = useState(0.0);
  const [valorMesAnterior, setValorMesAnterior] = useState(0.0);
  const [poupadoPercentagem, setPoupadoPercentagem] = useState(0.0);
  const [newTasks, setNewTasks] = useState("");
  let utilizador_id = localStorage.getItem('utilizador_id');
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
       const response = await api.get("/consumos?tipo=ultimosconsumos&utilizador_id=" + utilizador_id);
       //const response2 = await api.get("/consumos?tipo=consumosmensais&utilizador_id=" + utilizador_id);
       const data = response.data;
      setConsumidoNesteMes(parseFloat(data.totalConsumoMesAtual).toFixed(3));
      console.log("consumidoNesteMes: ", isNaN(consumidoNesteMes));
      setValorMesAtual(parseFloat(data.totalEurosPagarMesAtual).toFixed(2));
      console.log("valorMesAtual: ", isNaN(valorMesAtual));
      setValorMesAnterior(parseFloat(data.totalEurosPoupadosMesAnterior).toFixed(2));
      console.log("valorMesAnterior: ", isNaN(valorMesAnterior));
      const percentagem = parseFloat(((valorMesAtual - valorMesAnterior) / valorMesAnterior) * 100).toFixed(2);
      console.log("percentagem: ", isNaN(percentagem));
      setPoupadoPercentagem(isNaN(percentagem) || percentagem < 0 ? 0.0 : parseFloat(percentagem).toFixed(2));
      console.log("poupadoPercentagem: ", isNaN(poupadoPercentagem));
      setPoupadoeuros((valorMesAnterior-valorMesAtual).toFixed(2));
      console.log("poupadoeuros: ", isNaN(poupadoeuros));
      console.log("poupadoeuros: ", poupadoeuros);
      setNewTasks(null);
      setDadosMensuais(response.data);
      setIsLoadingData(false);
       
     } catch (error) {
       console.log(error);
     }
   };
    fetchData();
  }, []);
  
  if (isLoadingData)
  return (<Box pl={{ base: "45%", md: "45%", xl: "45%" }} pt={{ base: "45%", md: "45%", xl: "25%" }}><div className="loader"></div></Box>)
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 4   }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon
                  w="32px"
                  h="32px"
                  as={MdBarChart}
                  color={brandColor}
                />
              }
            />
          }
          name="Consumido neste mês"
          value={consumidoNesteMes + " m³"}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon
                  w="32px"
                  h="32px"
                  as={MdAttachMoney}
                  color={brandColor}
                />
              }
            />
          }
          name="Valor do mês atual"
          value={valorMesAtual + "€"}
        />
        <MiniStatistics growth={poupadoPercentagem} name="Poupado" poupadoeuros={poupadoeuros + "€"} />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
            />
          }
          name="New Tasks"
          value={newTasks}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <TotalSpent data={dadosMensuais} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
          <WeeklyRevenue />
          <PieCard  volumeconsumido={consumidoNesteMes}/>
      </SimpleGrid>
    </Box>
  );
}
