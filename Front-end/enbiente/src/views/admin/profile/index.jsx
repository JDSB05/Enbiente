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
import "../../../index.css";
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
  const [imagem, setImagem] = useState("");
  const fotolink = localStorage.getItem('foto');
  let utilizador = localStorage.getItem('utilizador_id');
  const [quantidadeCasas, setQuantidadeCasas] = useState(0);
  const [volumeTotalConsumido, setVolumeTotalConsumido] = useState(0);
  const [eurosGastos, setEurosGastos] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/tipoclientes');
        const response1 = await api.get('/utilizador/' + utilizador);
        const response2 = await api.get('/consumos?tipo=consumototal&utilizador_id=' + utilizador);
        console.log(response2.data)
        setTipoCliente(response.data);
        setNome(response1.data.nome);
        setNome1(response1.data.nome)
        setTelemovel(response1.data.telemovel);
        setEmail(response1.data.email);
        setQuantidadeCasas(response2.data.quantidadeCasas);
        setVolumeTotalConsumido(response2.data.totalConsumido);
        setEurosGastos(response2.data.eurosGastos);
        setIsLoadingData(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);
  if (isLoadingData)
  return (<Box pl={{ base: "45%", md: "45%", xl: "45%" }} pt={{ base: "45%", md: "45%", xl: "25%" }}><div className="loader"></div></Box>)
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "2fr",
          lg: "1.34fr 2.62fr",
        }}
        templateRows={{
          base: "repeat(2, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Banner
          gridArea={{ base: "1 / 1 / 1 / 1", lg: '1 / 1 / 2 / 2' }}
          banner={banner}
          avatar={avatar}
          nome={nome1}
          email={email}
          fotolink={fotolink}
          volumetotalconsumido={volumeTotalConsumido + " m³"}
          casas={quantidadeCasas}
          eurosgastos={eurosGastos + " €"}
        />
        <General
            gridArea={{ base: "2 / 1 / 4 / 4", lg: "1 / 2 / 2 / 4" }}
            minH='365px'
            marginBottom='20px'
            nome={nome ? nome : ""}
            telemovel={telemovel ? telemovel : ""}
            tipoCliente={tipoCliente ? tipoCliente : []} // Certifique-se de passar um array vazio
            setNome={setNome}
            setTelemovel={setTelemovel}
            setTipoCliente={setTipoClienteValor}
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
        <Upload
          gridArea={{
            base: "2 / 1 / 1 / 2",
            lg: "1 / 2 / 1 / 2",
          }}
          minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
          pe='20px'
          pb={{ base: "100px", lg: "20px" }}
          tema='Faça upload de uma foto de perfil'
          foto={imagem}
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
