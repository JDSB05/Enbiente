import React from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FiSearch } from "react-icons/fi";
import { RiFilterOffLine } from "react-icons/ri";

export function SearchBar(props) {
  // Pass the computed styles into the `__css` prop
  const { variant, background, children, placeholder, borderRadius, pesquisa, setPesquisa, setGlobal, ...rest } =
    props;
  // Chakra Color Mode
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");
  return (
    <InputGroup w={{ base: "100%", md: "200px" }} {...rest}>
      <InputLeftElement
				children={
					<IconButton
						bg='inherit'
						borderRadius='inherit'
						_hover='none'
						_active={{
							bg: 'inherit',
							transform: 'none',
							borderColor: 'transparent'
						}}
						_focus={{
							boxShadow: 'none'
						}}
						icon={<Icon as={FiSearch} color={searchIconColor} w='15px' h='15px' />}
					/>
				}
			/>
      <Input
        variant='search'
        fontSize='sm'
        bg={background ? background : inputBg}
        color={inputText}
        fontWeight='500'
        value={pesquisa}
        _placeholder={{ color: "gray.400", fontSize: "14px" }}
        borderRadius={borderRadius ? borderRadius : "30px"}
        placeholder={placeholder ? placeholder : "Procurar..."}
      />
      <InputRightElement
        onClick={() => {
          setPesquisa("")
          setGlobal("")
        }}
      children={
        <IconButton
          bg='inherit'
          borderRadius='inherit'
          _hover='none'
          _active={{
            bg: 'inherit',
            transform: 'none',
            borderColor: 'transparent'
          }}
          _focus={{
            boxShadow: 'none'
          }}
          icon={<Icon as={RiFilterOffLine} color={searchIconColor} w='15px' h='15px' />}
        />
      }
    />
    </InputGroup>
  );
}
