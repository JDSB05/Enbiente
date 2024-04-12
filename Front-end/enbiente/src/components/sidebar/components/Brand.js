import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import HydroTrackLogo from "../../../assets/img/layout/HydroAHsemfundo.png";
import { HSeparator } from "../../../components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <img src={HydroTrackLogo} alt='HydroTrack' className="py-3" style={{ width: 'auto', height: '120px' }} />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
