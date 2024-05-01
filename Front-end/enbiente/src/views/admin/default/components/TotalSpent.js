// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/card/Card.js";
import LineChart from "../../../../components/charts/LineChart";
import React from "react";
import moment from "moment";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function TotalSpent(props) {
  const { data, ...rest } = props;

  // Chakra Color Mode
  let precoMedio = 0
  let precoAnual = 0
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  const getMonthArray = () => {
    const mesesEmPortugues = {
      '01': 'Jan',
      '02': 'Fev',
      '03': 'Mar',
      '04': 'Abr',
      '05': 'Maio',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Ago',
      '09': 'Set',
      '10': 'Out',
      '11': 'Nov',
      '12': 'Dez'
    };
    
    const dadosFormatados = Object.entries(data.totalConsumoMes).reduce((acc, [data, valor]) => {
      const [mes, ano] = data.split('/');
      const mesPorExtenso = mesesEmPortugues[mes];
      acc[`${mesPorExtenso} - ${ano}`] = valor;
      return acc;
    }, {});
    return Object.keys(dadosFormatados).reverse();
  };

  // Example usage
  const months = getMonthArray();
  const lineChartOptionsTotalSpent = {
    chart: {
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: "#4318FF",
      },
    },
    colors: ["#4318FF", "#39B8FF"],
    markers: {
      size: 0,
      colors: "white",
      strokeColors: "#7551FF",
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      type: "line",
    },
    xaxis: {
      type: "numeric",
      categories: months,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      column: {
        color: ["#7551FF", "#39B8FF"],
        opacity: 0.5,
      },
    },
    color: ["#7551FF", "#39B8FF"],
  };
  // Converter o data.totalConsumoMes para um array de objetos do tipo [30, 40, 24, 46, 20, 46]
  const volumeArray = Object.values(data.totalConsumoMes).reverse();
  const custoArray = Object.values(data.totalEurosPagarMes).reverse();
  // Média de todos os valores do array
  precoMedio = (custoArray.reduce((a, b) => a + b, 0) / custoArray.length).toFixed(2);
  //Soma de todos os valores do array
  precoAnual = (custoArray.reduce((a, b) => a + b, 0)).toFixed(2);
  const lineChartDataTotalSpent = [
    {
      name: "Volume",
      data: volumeArray,
    },
    {
      name: "Preço",
      data: custoArray,
    },
  ];
  
  return (
    <Card
      justifyContent='center'
      align='center'
      direction='column'
      w='100%'
      mb='0px'
      {...rest}>
      <Flex justify='space-between' ps='0px' pe='20px' pt='5px'>
        <Flex align='center' w='100%'>
          <Text color={textColor} fontSize='xl' fontWeight='600' mt='4px'>
            Consumo Mensal
          </Text>
        </Flex>
      </Flex>
      <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection='column' mr='15px' mt='28px'>
          <Text
            color={textColor}
            fontSize='34px'
            textAlign='start'
            fontWeight='700'
            lineHeight='100%'>
            Media mensal: {precoMedio + " €"}
          </Text>
          <Flex align='center' mb='20px'>
            <Text
              color='secondaryGray.600'
              fontSize='sm'
              fontWeight='500'
              mt='4px'
              me='12px'>
              Soma anual: {precoAnual + " €"}
            </Text>
          </Flex>
        </Flex>
        <Box minH='260px' minW='75%' mt='auto'>
          <LineChart
            chartData={lineChartDataTotalSpent}
            chartOptions={lineChartOptionsTotalSpent}
          />
        </Box>
      </Flex>
    </Card>
  );
}
