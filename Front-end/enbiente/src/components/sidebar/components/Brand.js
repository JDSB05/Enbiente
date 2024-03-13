import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import AquaTrackLogo from "../../../assets/img/layout/AquaAHsemfundo.png";
import { HSeparator } from "../../../components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <img src={AquaTrackLogo} alt='AquaTrack' className="py-3" style={{ width: 'auto', height: '120px' }} />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
