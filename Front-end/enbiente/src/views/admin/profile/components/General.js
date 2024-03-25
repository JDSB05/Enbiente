import React from "react";
import { SimpleGrid, Text, useColorModeValue, Input, FormLabel, FormControl, Select, Button } from "@chakra-ui/react";
import Card from "../../../../components/card/Card.js";
import api from "../../../../services/api.js";

export default function GeneralInformation(props) {
  const { nome, telemovel, tipoCliente, setNome, setTelemovel, setTipoCliente, ...rest } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const [isLoading, setIsLoading] = React.useState(false);
  const [tipoClienteValor, setTipoClienteValor] = React.useState("");
  
  function submit() {
    setIsLoading(true);
    try {
      console.log(nome, telemovel, tipoCliente); 
      
      api.put('/utilizador/' + localStorage.getItem('utilizador_id'), { nome: nome, telemovel: telemovel, tipo_cliente_id: parseInt(tipoClienteValor)})
        .then(() => {
          console.log("Dados do usuário atualizados com sucesso!");
          setIsLoading(false);
          localStorage.setItem('utilizador_nome', nome);
          window.location.reload();
        })
        .catch(error => {
          console.error("Erro ao atualizar dados do usuário:", error);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Erro ao fazer requisição para atualizar dados do usuário:", error);
      setIsLoading(false);
    }
  }

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        Dados do seu perfil
      </Text>
      <SimpleGrid columns='1' gap='20px'>
        <div>
          <FormLabel
            display='flex'
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
          >
            Nome
          </FormLabel>
          <Input
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            variant='auth'
            fontSize='sm'
            ms={{ base: "0px", md: "0px" }}
            type='text'
            placeholder='Nome'
            fontWeight='500'
            size='lg'
            isrequired={true}
          />
        </div>
        <div>
          <FormLabel
            display='flex'
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
          >
            Telemóvel
          </FormLabel>
          <Input
            value={telemovel}
            onChange={(event) => setTelemovel(event.target.value)}
            variant='auth'
            fontSize='sm'
            type='number'
            placeholder='+351 912 345 678'
            fontWeight='500'
            size='lg'
            isrequired={true}
          />
        </div>
        <div>
          <FormControl id="country">
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
            >
              Tipo de Cliente
            </FormLabel>
            <Select
              placeholder="Selecione o tipo de cliente"
              variant="auth"
              border="1px"
              value={tipoCliente.tipo_cliente_id} // Alterando para acessar diretamente o ID
              onChange={(event) => setTipoClienteValor(event.target.value)} // Atualizando para armazenar o ID no estado
            >
              {tipoCliente.map((tipo, index) => (
                <option key={tipo.tipo_cliente_id} value={tipo.tipo_cliente_id}>
                  {tipo.tipo_cliente}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <Button
            isLoading={isLoading}
            onClick={submit}
            fontSize='sm'
            variant='brand'
            fontWeight='500'
            mt="10px"
            w='100%'
            h='50'
            mb='24px'>
            Guardar
          </Button>
        </div>
      </SimpleGrid>
    </Card>
  );
}
