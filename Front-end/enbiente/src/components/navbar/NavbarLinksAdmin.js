// Chakra Imports
import {
	Avatar,
	Button,
	Flex,
	Icon,
	Image,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorModeValue,
	useColorMode
} from '@chakra-ui/react';
// Custom Components
import { ItemContent } from '../../components/menu/ItemContent';
import { SearchBar } from '../../components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from '../sidebar/SidebarAdmin';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
// Assets
import navImage from '../../assets/img/layout/Navbar.png';
import { MdNotifications, MdNotificationImportant } from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { FaEthereum } from 'react-icons/fa';
import routes from '../../routes.js';
import api from '../../services/api';
import { ThemeEditor } from './ThemeEditor';
import  FixedPlugin  from '../fixedPlugin/FixedPlugin';
import { Redirect, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { useUser } from '../../UserProvider'; // Importando o hook useUser
import './style.css';

export default function HeaderLinks(props) {
	const { secondary } = props;
	const { colorMode, toggleColorMode } = useColorMode();
	const nome = localStorage.getItem('utilizador_nome');
	//const [email, setEmail] = React.useState('');
	// Chakra Color Mode
	const navbarIcon = useColorModeValue('gray.400', 'white');
	let menuBg = useColorModeValue('white', 'navy.800');
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorBrand = useColorModeValue('brand.700', 'brand.400');
	const ethColor = useColorModeValue('gray.700', 'white');
	const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
	const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
	const ethBox = useColorModeValue('white', 'navy.800');
	const shadow = useColorModeValue(
		'14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
		'14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
	);
	const cargo = localStorage.getItem('cargo');
	const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
	const btnRef = React.useRef();
	const [alertas, setAlertas] = useState([]);
	const [fotolink, setFotolink] = useState('');
	const { fotoUsuario, updateComponent, updateUserComponent } = useUser(); // Usando o fotoUsuario do contexto
	useEffect(() => {
		function fetchAlertas(){
			//fetch alertas
			try {
				api.get('/alertas').then((response) => {
					setAlertas(response.data);
				});
			} catch (error) {
				console.log('Erro ao buscar alertas', error);
			}
		}
		fetchAlertas();
	}, [updateComponent]);

	useEffect(() => {
		const foto = localStorage.getItem('foto');
		if (foto) {
			setFotolink(foto);
		}
	}, []); // Definindo fotolink no estado local ao montar o componente

	function marcarAlertasComoLidas() {
		//marcar alertas como lidas
		for (let i = 0; i < alertas.length; i++) {
			if (alertas[i].estado) 
				api.put(`/alertas/${alertas[i].alerta_id}`, { estado: false }).then((response) => {
				console.log('Alertas marcadas como lidas', response.data);
				updateUserComponent();
			});
		}
	}
	function marcarAlertaComoLida(id) {
		//marcar alerta como lida
		api.put(`/alertas/${id}`, { estado: false }).then((response) => {
			console.log('Alerta marcado como lido', response.data);
			updateUserComponent();
		});
	}
	function logout() {
		localStorage.removeItem('email');
		localStorage.removeItem('utilizador_id');
		localStorage.removeItem('cargo');
		localStorage.removeItem('utilizador_nome');
		localStorage.removeItem('token');
		localStorage.removeItem('foto');
		window.location.href = '#/login';
	}
	function gotoPerfil() {
		if (cargo === '1') window.location.href = '#/admin/profile';
		else if (cargo === '2') window.location.href = '#/user/profile';
		else if (cargo === '3') window.location.href = '#/admin/profile';
	}
	return (
		<Flex
			w={{ sm: '100%', md: 'auto', lg: 'auto'}}
			alignItems="center"
			flexDirection="row"
			bg={menuBg}
			flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
			p="10px"
			borderRadius="30px"
			boxShadow={shadow}>

			<SidebarResponsive align='center' justify='center' routes={routes} />
			
			<Menu>
				<MenuButton mt='-1px' mx='5px' ml='10px' align='center' justify='center'>
					{alertas.some(alerta => alerta.estado) ? (
						<Icon className='ItemCampainha' as={MdNotificationImportant} color={navbarIcon} w="18px" h="18px" />
					) : (
						<Icon as={MdNotifications} color={navbarIcon} w="18px" h="18px" />
					)}
				</MenuButton>
				<MenuList
					boxShadow={shadow}
					p="20px"
					borderRadius="20px"
					bg={menuBg}
					border="none"
					mt="22px"
					me={{ base: '30px', md: 'unset' }}
					minW={{ base: 'unset', md: '400px', xl: '450px' }}
					maxW={{ base: '360px', md: 'unset' }}
					>
					<Flex jusitfy="space-between" w="100%" mb="20px">
						<Text fontSize="md" fontWeight="600" color={textColor}>
							Alertas
						</Text>
						<Text fontSize="sm" fontWeight="500" color={textColorBrand} ms="auto" cursor="pointer" onClick={marcarAlertasComoLidas}>
							Marcas todas como lidas
						</Text>
					</Flex>
					<Flex flexDirection="column">
						{alertas
							.sort((a, b) => new Date(b.data_alerta) - new Date(a.data_alerta)) // Ordena todas as alertas por data_alerta em ordem decrescente
							.filter((alerta, index) => alerta.estado || index < 5) // Filtra para mostrar todas as alertas com estado=true e as últimas 5 alertas com estado=false
							.map((alerta, index) => (
								<MenuItem key={index} className={alerta.estado ? "ItemRespiracao" : ""} _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} borderRadius="8px" mb="10px" px="8px">
									<ItemContent tipoalerta={alerta.tipo_alerta} info={alerta.Casa.nome} descricao={alerta.mensagem_alerta} estado={alerta.estado} marcarlida={marcarAlertaComoLida} alerta_id={alerta.alerta_id} />
								</MenuItem>
							))}
					</Flex>
				</MenuList>
			</Menu>
			<Flex
				ref={btnRef}
				w='max-content' 
				h='max-content'
				mx='5px'
				variant='no-effects'
				onClick={toggleColorMode}
				align='center'
				justify='center'>
				<Icon
					h='18px'
					w='18px'
					color={navbarIcon}
					as={colorMode === "light" ? IoMdMoon : IoMdSunny}
				/>
			</Flex>
			{/*<ThemeEditor navbarIcon={navbarIcon} />*/   //descomentar para ativar o editor de temas
			}

			<Menu>
				<MenuButton p="0px" mx='5px'>
					<Avatar
						_hover={{ cursor: 'pointer' }}
						color="white"
						name={nome === 'Francisca' ? 'Princesa' : nome}
						src={fotoUsuario || fotolink}
						bg="#11047A"
						size="sm"
						w="40px"
						h="40px"
					/>
				</MenuButton>
				<MenuList boxShadow={shadow} p="0px" mt="10px" borderRadius="20px" bg={menuBg} border="none">
					<Flex w="100%" mb="0px">
						<Text
							ps="20px"
							pt="16px"
							pb="10px"
							w="100%"
							borderBottom="1px solid"
							borderColor={borderColor}
							fontSize="sm"
							fontWeight="700"
							color={textColor}>
							👋&nbsp; Olá, {nome === 'Francisca' ? 'Princesa❤️' : nome}!
						</Text>
					</Flex>
					<Flex flexDirection="column" p="10px">
						<MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} borderRadius="8px" px="14px" onClick={gotoPerfil}>
							<Text fontSize="sm">Definições do perfil</Text>
						</MenuItem>
						<MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} borderRadius="8px" px="14px">
							<Text fontSize="sm">Notificações</Text>
						</MenuItem>
						<MenuItem
							_hover={{ bg: 'none' }}
							_focus={{ bg: 'none' }}
							color="red.400"
							borderRadius="8px"
							px="14px"
							onClick={logout}>
							<Text fontSize="sm">Log out</Text>
						</MenuItem>
					</Flex>
				</MenuList>
			</Menu>
		</Flex>
	);
}

HeaderLinks.propTypes = {
	variant: PropTypes.string,
	fixed: PropTypes.bool,
	secondary: PropTypes.bool,
	onOpen: PropTypes.func
};
