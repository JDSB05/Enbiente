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
import { Box, Grid } from "@chakra-ui/react";
import api from "../../../services/api"
// Custom components
import Banner from "../../../views/admin/profile/components/Banner";
import General from "../../../views/admin/profile/components/General";
import Notifications from "../../../views/admin/profile/components/Notifications";
import Projects from "./components/Casas";
import Storage from "../../../views/admin/profile/components/Storage";
import Upload from "../../../views/admin/profile/components/Upload";

// Assets
import banner from "../../../assets/img/auth/banner.png";
import avatar from "../../../assets/img/avatars/avatar4.png";
import React, { useState, useEffect } from "react";

export default function Overview() {
  const [nome, setNome] = useState("");
  const [nome1, setNome1] = useState("");
	const [email, setEmail] = useState("");
  const [tipoCliente, setTipoCliente] = useState([]);
  const [tipoClienteValor, setTipoClienteValor] = useState("");
  const [telemovel, setTelemovel] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/tipoclientes');
        const response1 = await api.get('/utilizador/' + localStorage.getItem('utilizador_id'));
        setTipoCliente(response.data);
        setNome(response1.data.nome);
        setNome1(response1.data.nome)
        setTelemovel(response1.data.telemovel);
        setEmail(response1.data.email);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);
  function handleSubirFicheiro(acceptedFiles) {
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
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 1fr 1.62fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Banner
          gridArea='1 / 1 / 2 / 2'
          banner={banner}
          avatar={avatar}
          nome={nome1}
          email={email}
          posts='17'
          followers='9.7k'
          following='274'
        />
        <Upload
          gridArea={{
            base: "3 / 1 / 4 / 2",
            lg: "1 / 3 / 2 / 4",
          }}
          minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
          pe='20px'
          pb={{ base: "100px", lg: "20px" }}
          tema='Tema'
          handleSubirFicheiro={handleSubirFicheiro}
        />
      </Grid>
      <Grid
        mb='20px'
        templateColumns={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1.34fr 1.62fr 1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Projects
          gridArea='1 / 2 / 2 / 2'
          banner={banner}
          avatar={avatar}
          name='Teste'
          job='Teste'
          posts='17'
          followers='9.7k'
          following='274'
        />
        <General
            gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
            minH='365px'
            pe='20px'
            nome={nome ? nome : ""}
            telemovel={telemovel ? telemovel : ""}
            tipoCliente={tipoCliente ? tipoCliente : []} // Certifique-se de passar um array vazio
            setNome={setNome}
            setTelemovel={setTelemovel}
            setTipoCliente={setTipoClienteValor}
          />
        <Notifications
          used={25.6}
          total={50}
          gridArea={{
            base: "3 / 1 / 4 / 2",
            lg: "2 / 1 / 3 / 3",
            "2xl": "1 / 3 / 2 / 4",
          }}
        />
      </Grid>
    </Box>
  );
}
