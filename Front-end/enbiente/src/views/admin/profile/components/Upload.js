import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Image
} from "@chakra-ui/react";
import Card from "../../../../components/card/Card.js";
import { MdUpload } from "react-icons/md";
import Dropzone from "../../../../views/admin/profile/components/Dropzone";
import api from "../../../../services/api";
import { useToast } from "../../../../components/toasts/toast.js";
import { useUser } from "../../../../UserProvider.js";

export default function Upload(props) {
  const { tema, ...rest } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "white");
  const { showErrorToast, showSuccessToast } = useToast();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { fotoUsuario, setFotoUsuario } = useUser();

  const handleSelectedFile = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10000000) {
        showErrorToast("O arquivo deve ter menos de 10MB, escolha outro ficheiro!");
        event.target.value = "";
      } else {
        setUploadedFile(file);
      }
    } else {
      showErrorToast("Utilize o formato de ficheiro correto!");
      event.target.value = "";
    }
  }

  async function handleSubirFicheiro() {
    setIsLoading(true);
    if (!uploadedFile) {
      showErrorToast("Você precisa selecionar uma imagem!");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("imagem", uploadedFile);
    try {
      const responseFoto = await api.post("/imagem", formData);

      if (responseFoto && responseFoto.status === 200) {
        if (responseFoto.data.message) {
          const urlImagem = responseFoto.data.message;
          await api.put("/utilizador/" + localStorage.getItem("utilizador_id"), { foto: urlImagem }).then((response) => {
            localStorage.setItem("foto", urlImagem);
            setFotoUsuario(urlImagem); // Atualiza a imagem globalmente
            setUploadedFile(null);
            showSuccessToast("Foto atualizada com sucesso!");
          }).catch((error) => {
            console.error("Erro ao atualizar foto do utilizador:", error)
            showErrorToast("Erro ao atualizar foto do utilizador! Recarregue a página e tente novamente.");
          });
          setIsLoading(false);
        }
        // Lógica adicional aqui, se necessário
      } else {
        console.error("Erro ao enviar arquivo:", responseFoto?.status);
        showErrorToast("Erro ao enviar arquivo! Recarregue a página e tente novamente.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      showErrorToast("Erro ao enviar arquivo! Recarregue a página e tente novamente.");
      setIsLoading(false);
      // Lidar com erros de rede aqui, se necessário
    }
  }

  return (
    <Card {...rest} mb='20px' align='center' p='20px' h='100%'>
      <Flex h='100%' direction={{ base: "column", "2xl": "row" }}>
        <Dropzone
          w={{ base: "100%", "2xl": "100%" }}
          me='36px'
          maxH={{ base: "auto", lg: "auto", "2xl": "100%" }}
          minH={{ base: "auto", lg: "auto", "2xl": "100%" }}
          handleSelectedFile={handleSelectedFile}
          content={
            <Box w='auto' h='auto'  alignContent='center' justifyContent='center'>
              {uploadedFile ? (
                <Image src={URL.createObjectURL(uploadedFile)} h='300px'  w='300px' objectFit='contain'alt="Imagem carregada" />
              ) : (
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
              )}
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
              isLoading={isLoading}
              onClick={(event) => handleSubirFicheiro(event)}>
              Salvar
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}