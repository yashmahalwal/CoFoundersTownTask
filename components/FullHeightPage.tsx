import { Box, BoxProps, Center } from "@chakra-ui/react"
import React from "react"

const   FullHeightPage: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      as="section"
      background={{ sm: "linear-gradient(to right, #36d1dc, #5b86e5)" }}
      bgSize="cover"
      {...props}
    >
      <Center minH="100vh">{children}</Center>
    </Box>
  )
}
export default FullHeightPage
