import React, {useState, useEffect, useRef} from "react";
import MiniCalendar from "../../components/calendar/MiniCalendar";
import moment from "moment";
// Chakra imports
import {
  Icon,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import {
  MdOutlineMoreHoriz,
  MdOutlinePerson,
  MdOutlineCardTravel,
  MdOutlineLightbulb,
  MdOutlineSettings,
} from "react-icons/md";

export default function Banner(props) {
  const { icon, setGlobal, setPesquisa, ...rest } = props;

  let data = new Date();
  const textColor = useColorModeValue("secondaryGray.500", "white");
  const textHover = useColorModeValue(
    { color: "secondaryGray.900", bg: "unset" },
    { color: "secondaryGray.500", bg: "unset" }
  );
  const iconColor = useColorModeValue("brand.500", "white");
  const bgList = useColorModeValue("white", "whiteAlpha.100");
  const bgShadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
    // Ref para o MenuList
    const menuListRef = useRef();

    // Estado para controlar a abertura do menu
    const [isMenuOpen, setMenuOpen] = useState(false);

    // Função para abrir o menu
    const openMenu = () => {
      setMenuOpen(true);
    };
  
    // Função para fechar o menu
    const closeMenu = () => {
      setMenuOpen(false);
    };

    // Adiciona um event listener quando o componente é montado
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verifica se o clique foi fora do MenuList
      if (menuListRef.current && !menuListRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    // Adiciona o listener ao documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpa o listener quando o componente é desmontado
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Menu isOpen={isMenuOpen} onClose={closeMenu}>
      <MenuButton
        align='center'
        justifyContent='center'
        bg={bgButton}
        _hover={bgHover}
        _focus={bgFocus}
        _active={bgFocus}
        w='37px'
        h='37px'
        lineHeight='100%'
        onClick={openMenu}
        borderRadius='10px'
        {...rest}>
        <Icon as={icon} color={iconColor} w='24px' h='24px' />
      </MenuButton>
      <MenuList
        w='100%'
        minW='unset'
        maxW='100%'
        border='transparent'
        backdropFilter='blur(63px)'
        bg={bgList}
        boxShadow={bgShadow}
        borderRadius='20px'
        onClick={(event) => {
          // Pare a propagação para evitar que o evento de clique feche o menu
          event.stopPropagation();
        }}
        p='15px'>
          <Flex align='center' w="auto" h='auto'>
          <MiniCalendar
            selectRange={false}
            onChange={(value, event) => {
              data = value;
              data = moment(data).utc().format("YYYY-MM-DD")
              setGlobal(data);
              setPesquisa(data);
              closeMenu();
            }}
            value={data}
            justifyContent="center"
            isRequired={true}
            maxDate={new Date()}
            mb='5px'
          />
          </Flex>
      </MenuList>
    </Menu>
  );
}
