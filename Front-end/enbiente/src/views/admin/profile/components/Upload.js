import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "../../../../components/card/Card.js";
import React from "react";
import { MdUpload } from "react-icons/md";
import Dropzone from "../../../../views/admin/profile/components/Dropzone";
import api from "../../../../services/api";

export default function Upload(props) {
  const { tema, uploadedFile, ...rest } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "white");

  function handleSubirFicheiro(acceptedFiles) {
    // Verificar se acceptedFiles não é undefined antes de iterá-lo
    if (!acceptedFiles) {
      console.error('Nenhum arquivo aceito foi fornecido.');
      return;
    }

    // Criar um objeto FormData para enviar os arquivos
    const formData = new FormData();

    // Adicionar os arquivos aceitos ao objeto FormData
    acceptedFiles.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    // Enviar os arquivos para a API
    api.post('/upload', formData)
      .then(response => {
        if (response.status === 200) {
          console.log('Arquivos enviados com sucesso!');
          // Adicionar lógica adicional aqui, se necessário
        } else {
          console.error('Erro ao enviar arquivos:', response.status);
          // Lidar com erros de envio aqui, se necessário
        }
      })
      .catch(error => {
        console.error('Erro ao enviar arquivos:', error);
        // Lidar com erros de rede aqui, se necessário
      });
  }

  return (
    <Card {...rest} mb='20px' align='center' p='20px'>
      <Flex h='100%' direction={{ base: "column", "2xl": "row" }}>
        <Dropzone
          w={{ base: "100%", "2xl": "268px" }}
          me='36px'
          maxH={{ base: "60%", lg: "50%", "2xl": "100%" }}
          minH={{ base: "60%", lg: "50%", "2xl": "100%" }}
          content={
            <Box>
              <Icon as={MdUpload} w='80px' h='80px' color={brandColor} />
              <Flex justify='center' mx='auto' mb='12px'>
                <Text fontSize='xl' fontWeight='700' color={brandColor}>
                  Subir ficheiro
                </Text>
              </Flex>
              <Text fontSize='sm' fontWeight='500' color='secondaryGray.500'>
                PNG, JPG e GIF são permitidos
              </Text>
            </Box>
          }
        />
        <Flex direction='column' justifyContent="center" w='100%' maxW='100%'>
          <Flex w='100%' justifyContent="center">
            <Text
              color={textColorPrimary}
              fontWeight='bold'
              textAlign='center'  
              fontSize='2xl'
              mt={{ base: "20px", "2xl": "50px" }}>
              {tema}
            </Text>
          </Flex>
          <Flex w='100%' justifyContent="center">
            <Button
              mb='50px'
              w='140px'
              minW='140px'
              mt={{ base: "20px", "2xl": "auto" }}
              variant='brand'
              fontWeight='500'
              onClick={() => handleSubirFicheiro(uploadedFile)}>
              Salvar
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}