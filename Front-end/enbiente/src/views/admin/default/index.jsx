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
import "../../../index.css";
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
  const [consumidoNesteMes, setConsumidoNesteMes] = useState("");
  const [poupadoeuros, setPoupadoeuros] = useState("");
  const [valorMesAtual, setValorMesAtual] = useState("");
  const [valorMesAnterior, setValorMesAnterior] = useState("");
  const [poupadoPercentagem, setPoupadoPercentagem] = useState("");
  const [newTasks, setNewTasks] = useState("");
  const [totalProjects, setTotalProjects] = useState("");
  let utilizador_id = localStorage.getItem('utilizador_id');
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/consumos?tipo=ultimosconsumos&utilizador_id=" + utilizador_id);
      const data = response.data;
      console.log(data);
      const poupadoValue = parseFloat(data.lastMonthWaterValue); // Convert to number
      setConsumidoNesteMes(data.totalConsumoMesAtual + " m³")
      setValorMesAtual(data.totalEurosPagarMesAtual + "€");
      setValorMesAnterior(data. totalEurosPoupadosMesAnterior + "€");
      const poupadoAnterior = parseFloat(data.penultimateMonthWaterValue); // replace with the actual value of poupado do mês anterior
      const poupadoGrowthValue = (((poupadoValue - poupadoAnterior) / poupadoAnterior) * 100).toFixed(2);
      setPoupadoPercentagem(poupadoGrowthValue);
      setPoupadoeuros((poupadoAnterior-poupadoValue).toFixed(2) + "€");
      setNewTasks(data.newTasks);
      setTotalProjects(data.totalProjects);
      setIsLoadingData(false);
      response = await api.get("/consumos?tipo=consumosmensais&utilizador_id=" + utilizador_id);
      console.log(response);
      setDadosMensuais(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoadingData)
  return (<Box pl={{ base: "45%", md: "45%", xl: "45%" }} pt={{ base: "45%", md: "45%", xl: "25%" }}><div className="loader"></div></Box>)
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
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
          value={consumidoNesteMes}
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
          value={valorMesAtual}
        />
        <MiniStatistics growth={poupadoPercentagem ? poupadoPercentagem : "Sem dados"} name="Poupado" value={poupadoeuros ? poupadoeuros : "Sem dados"} />
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
                  as={MdFileCopy}
                  color={brandColor}
                />
              }
            />
          }
          name="Total Projects"
          value={totalProjects}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <TotalSpent data={dadosMensuais} />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <CheckTable
          columnsData={columnsDataCheck}
          tableData={tableDataCheck}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
