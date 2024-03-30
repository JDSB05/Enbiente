import { Button, Flex, Input, useColorModeValue } from "@chakra-ui/react";
// Assets
import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = (props) => {
  const { content, handleSelectedFile, ...rest } = props; // Adicionei onChange às props
  const { getRootProps, getInputProps } = useDropzone({
    ...rest,
    onDrop: (acceptedFiles) => {
      handleSelectedFile({ target: { files: acceptedFiles } }); // Call handleSelectedFile here
    },
  });
  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  
  return (
    <Flex
      align='center'
      justify='center'
      bg={bg}
      border='1px dashed'
      borderColor={borderColor}
      borderRadius='16px'
      w='100%'
      h='max-content'
      minH='100%'
      cursor='pointer'
      {...getRootProps({ className: "dropzone" })}
      {...rest}>

      {/* Adicione o onChange ao componente Input */}
      <Input variant='main' onChange={handleSelectedFile} {...getInputProps()} />
      <Button variant='no-effects' >{content}</Button>
    </Flex>
  );
}

export default Dropzone;