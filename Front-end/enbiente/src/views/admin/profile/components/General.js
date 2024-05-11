import React from "react";
import { SimpleGrid, Text, useColorModeValue, Input, FormLabel, FormControl, Select, Button } from "@chakra-ui/react";
import Card from "../../../../components/card/Card.js";
import api from "../../../../services/api.js";
import { useToast } from '../../../../components/toasts/toast';
import { useUser } from '../../../../UserProvider.js';

export default function GeneralInformation(props) {
  const { nome, telemovel, tipoCliente, setNome, setTelemovel, setTipoCliente, ...rest } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const [isLoading, setIsLoading] = React.useState(false);
  const [tipoClienteValor, setTipoClienteValor] = React.useState("");
  const { showErrorToast, showSuccessToast, showMessageToast } = useToast();
  const { updateComponent, updateUserComponent } = useUser();
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/utilizador/' + localStorage.getItem('utilizador_id'));
        setNome(response.data.nome);
        setTelemovel(response.data.telemovel);
        setTipoClienteValor(response.data.tipo_cliente_id);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        showErrorToast("Erro ao buscar dados do usuário.");
      }
    };
    fetchData();
  }, [updateComponent]);

  function submit() {
    setIsLoading(true);

    
    if (nome.trim() === "") {
      setIsLoading(false);
      showErrorToast("Por favor, insira um nome válido.");
      return;
  }
    // Verificar se o nome está vazio
    if (nome === "") {
        setIsLoading(false);
        showErrorToast("Por favor, insira seu nome.");
        return;
    }

    // Verificar se o número de telefone está vazio
    if (telemovel === "") {
        setIsLoading(false);
        showErrorToast("Por favor, insira um número de telefone.");
        return;
    }

    // Verificar se o número de telefone é um número válido
    if (isNaN(telemovel) || !/^\d+$/.test(telemovel)) {
        setIsLoading(false);
        showErrorToast("Por favor, insira um número de telefone válido.");
        return;
    }

    // Verificar se o número de telefone está dentro do intervalo esperado
    if (telemovel.length < 9 || telemovel.length > 12) {
        setIsLoading(false);
        showErrorToast("O número de telefone deve ter entre 9 e 12 dígitos.");
        return;
    }

    // Verificar se o tipo de cliente está selecionado
    if (tipoClienteValor === "") {
        setIsLoading(false);
        showErrorToast("Por favor, selecione um tipo de cliente.");
        return;
    }
    try { 
      
      api.put('/utilizador/' + localStorage.getItem('utilizador_id'), { nome: nome, telemovel: telemovel, tipo_cliente_id: parseInt(tipoClienteValor)})
        .then(() => {
          showSuccessToast("Dados do usuário atualizados com sucesso.");
          setIsLoading(false);
          localStorage.setItem('utilizador_nome', nome);
          updateUserComponent();
        })
        .catch(error => {
          console.error("Erro ao atualizar dados do usuário:", error);
          showErrorToast("Erro ao atualizar dados do usuário.");
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
        <SimpleGrid columns='2' gap='20px'>
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
              value={tipoClienteValor} // Alterando para acessar diretamente o ID
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
        </SimpleGrid>
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
