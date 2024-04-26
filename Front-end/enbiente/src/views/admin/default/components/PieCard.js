// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/card/Card.js";
import PieChart from "../../../../components/charts/PieChart";
import { VSeparator } from "../../../../components/separator/Separator";
import React, {useState, useEffect} from "react";
import { wait } from "@testing-library/user-event/dist/utils/index.js";

export default function Conversion(props) {
  const {volumeconsumido, ...rest } = props;

  // Chakra Color Mode 
  const [higienePessoal, setHigienePessoal] = useState("");
  const [lavagemRoupa, setLavagemRoupa] = useState("");
  const [lavagemLoica, setLavagemLoica] = useState("");
  const [descargaSanitaria, setDescargaSanitaria] = useState("");
  const [outros, setOutros] = useState("");
  const [dadosProntos, setDadosProntos] = useState(false);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const pieChartOptions = {
    labels: ["Higiene Pessoal", "Lavagem de Roupa", "Descargas de Água", "Lavagem de Louça e limpeza doméstica", "Outros"],
    colors: ["#4318FF", "#6AD2FF", "#32AC00", "#FFC700", "#FF4D4D"],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ["#4318FF", "#6AD2FF", "#32AC00", "#FFC700", "#FF4D4D"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };
  useEffect(() => {
    // Verificar se volumeconsumido não é nulo ou indefinido
    if (volumeconsumido) {
      // Atualizar os estados com os valores calculados
      setHigienePessoal(parseFloat((volumeconsumido * 0.20).toFixed(3)));
      setLavagemRoupa(parseFloat((volumeconsumido * 0.20).toFixed(3)));
      setLavagemLoica(parseFloat((volumeconsumido * 0.20).toFixed(3)));
      setDescargaSanitaria(parseFloat((volumeconsumido * 0.30).toFixed(3)));
      setOutros(parseFloat((volumeconsumido * 0.10).toFixed(3)));

      // Definir dadosProntos como true para indicar que os dados estão prontos
      setDadosProntos(true);
    }
  }, [volumeconsumido]); // Dependência do useEffect
  const pieChartData = [higienePessoal, lavagemRoupa, descargaSanitaria, lavagemLoica, outros];

  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'>
        <Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
          Percentagem de consumos
        </Text>
      </Flex>

      {dadosProntos ? (
        <PieChart
          h='100%'
          w='100%'
          chartData={pieChartData}
          chartOptions={pieChartOptions}
        />
      ) : "Sem dados disponíveis"}
      {console.log(pieChartData)}
      <Card
        bg={cardColor}
        flexDirection='row'
        boxShadow={cardShadow}
        w='100%'
        p='15px'
        px='20px'
        mt='15px'
        mx='auto'
        justifyContent='center'
        overflow='hidden'>
        <Flex direction='column'  py='5px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='brand.500' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Higiene
            </Text>
          </Flex>
          <Text fontSize='md' color={textColor} fontWeight='700'>
            {higienePessoal} m³
          </Text>
        </Flex>
        <VSeparator mx={{ base: "20px", xl: "20px", "2xl": "20px" }} />
        <Flex direction='column' py='5px' me='10px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='#6AD2FF' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Lavagem de Roupa
            </Text>
          </Flex>
          <Text fontSize='md' color={textColor} fontWeight='700'>
            {lavagemRoupa} m³       
          </Text>
        </Flex>
        <VSeparator mx={{ base: "20px", xl: "20px", "2xl": "20px" }} />
        <Flex direction='column' py='5px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='#32AC00' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Descargas de Água
            </Text>
          </Flex>
          <Text fontSize='md' color={textColor} fontWeight='700'>
            {descargaSanitaria} m³
          </Text>
        </Flex>
        <VSeparator mx={{ base: "20px", xl: "20px", "2xl": "20px" }} />
        <Flex direction='column' py='5px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='#FFC700' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Lavagem de Louça
            </Text>
          </Flex>
          <Text fontSize='md' color={textColor} fontWeight='700'>
            {lavagemLoica} m³
          </Text>
        </Flex>
        <VSeparator mx={{ base: "20px", xl: "20px", "2xl": "20px" }} />
        <Flex direction='column' py='5px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='#FF4D4D' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Outros
            </Text>
          </Flex>
          <Text fontSize='md' color={textColor} fontWeight='700'>
            {outros} m³
          </Text>
        </Flex>
      </Card>
    </Card>
  );
}
