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
  MdNotifications,
} from "react-icons/md";


import PieCard from "../../../views/admin/default/components/PieCard";
import TotalSpent from "../../../views/admin/default/components/TotalSpent";
import WeeklyRevenue from "../../../views/admin/default/components/WeeklyRevenue";


import { useEffect, useState } from "react";
import { useToast } from "../../../components/toasts/toast";
import { useUser } from "../../../UserProvider";
import api from '../../../services/api';

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [dadosMensais, setDadosMensais] = useState([]); 
  const [consumidoNesteMes, setConsumidoNesteMes] = useState("");
  const [poupadoeuros, setPoupadoeuros] = useState("");
  const [valorMesAtual, setValorMesAtual] = useState("");
  const [valorMesAnterior, setValorMesAnterior] = useState("");
  const [poupadoPercentagem, setPoupadoPercentagem] = useState("");
  let utilizador_id = localStorage.getItem('utilizador_id');
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const { showMessageToast, showErrorToast } = useToast();
  const [consumosPorCasa, setConsumosPorCasa] = useState([]);
  const [mostrar1, setMostrar1] = useState(true);
  const [mostrar2, setMostrar2] = useState(true);
  const [mostrar3, setMostrar3] = useState(true);
  const { updateComponent, updateUserComponent, numeroAlertas } = useUser();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let currentPath = window.location.href;
        currentPath = currentPath.split('#')[1];
        sessionStorage.setItem('lastPath', currentPath);
        const response = await api.get("/consumos?tipo=ultimosconsumos&utilizador_id=" + utilizador_id);
        const response2 = await api.get("/consumos?tipo=consumosmensais&utilizador_id=" + utilizador_id);
        const response3 = await api.get("/consumos?tipo=consumosporcasa&utilizador_id=" + utilizador_id);
        const data = response.data;
        const data2 = response2.data;
        const data3 = response3.data;
        setConsumidoNesteMes(parseFloat(data.totalConsumoMesAtual));
        setValorMesAtual(parseFloat(data.totalEurosPagarMesAtual));
        setValorMesAnterior(parseFloat(data.totalEurosPoupadosMesAnterior));
        setPoupadoPercentagem(data.poupadoPercentagem);
        setPoupadoeuros(data.poupadoEuros);
        setDadosMensais(data2);
        setConsumosPorCasa(data3);
        setIsLoadingData(false);
      } catch (error) {
        console.log(error);
        showErrorToast("Erro ao buscar dados do mês atual");
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if ((consumidoNesteMes === 0 || valorMesAtual === 0 || poupadoeuros === 0 || poupadoPercentagem === 0)) {
      showMessageToast("Não existem dados suficientes para mostrar os dados, adicione consumos para mostrar as estatisticas.");
      setMostrar1(dadosMensais && Object.keys(dadosMensais.totalConsumoMes).length !== 0);
      setMostrar2(consumosPorCasa && consumosPorCasa.totalConsumoMesAtual && Object.keys(consumosPorCasa.totalConsumoMesAtual).length !== 0);
      setMostrar3(consumidoNesteMes !== null && consumidoNesteMes !== undefined && consumidoNesteMes !== 0);
  }
}, [consumidoNesteMes, valorMesAtual, poupadoeuros, poupadoPercentagem, dadosMensais, consumosPorCasa]);

  if (isLoadingData)
  return (<Box pl={{ base: "45%", md: "45%", xl: "45%" }} pt={{ base: "45%", md: "45%", xl: "25%" }}><div className="loader"></div></Box>)
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 2, "2xl": 4   }}
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
        <MiniStatistics growth={poupadoPercentagem} name="Poupado desde o mês anterior" poupadoeuros={poupadoeuros + "€"} />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdNotifications} color="white" />}
            />
          }
          name="Alertas: "
          value={numeroAlertas}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <TotalSpent data={dadosMensais} mostrar={mostrar1}/>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
          <WeeklyRevenue data={consumosPorCasa} mostrar={mostrar2}/>
          <PieCard  volumeconsumido={consumidoNesteMes} mostrar={mostrar3}/>
      </SimpleGrid>
    </Box>
  );
}
