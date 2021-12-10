import React from "react";
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  StatusBar,
  Avatar,
  useColorMode,
  ScrollView,
  Pressable,
  Center,
  IconButton,
  Divider,
  Stack,
  Link,
  Hidden,
  Menu,
  Heading
} from "native-base";

import {
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";


import {
  Container,
  Row,
  Col,
  Card,
  Button
} from 'react-bootstrap';


export default function (props: any) {
  // const router = useRouter(); //use incase of Nextjs

  const { colorMode } = useColorMode();
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box
        safeAreaTop
        _light={{ bg: "primary.900" }}
        _dark={{ bg: "coolGray.900" }}
      />
      <VStack
        flex={1}
        _light={{ bg: "coolGray.100" }}
        _dark={{ bg: "customGray" }}
      >
        <Box
          px={{ base: "4", md: "8" }}
          pt={{ base: "4", md: "3" }}
          pb={{ base: "5", md: "3" }}
          borderBottomWidth={{ md: "1" }}
          _dark={{ bg: "coolGray.900", borderColor: "coolGray.700" }}
          _light={{
            bg: { base: "primary.900", md: "primary.900" },
            borderColor: "coolGray.200",
          }}
        >
          {/* Mobile header */}
          <Hidden from="md">
            <HStack space="2" justifyContent="space-between">
              <HStack space="2" alignItems="center">
                <IconButton
                  variant="ghost"
                  colorScheme="light"
                  icon={
                    <Icon
                      size="6"
                      as={AntDesign}
                      name="arrowleft"
                      color="coolGray.50"
                    />
                  }
                />
                <Text color="coolGray.50" fontSize="lg">
                  Titulo Movil
                </Text>
              </HStack>
            </HStack>
          </Hidden>
          {/* Desktop header */}
          <Hidden till="md">
            <HStack alignItems="center" justifyContent="space-between">
              <HStack space="8" alignItems="center">
                <IconButton
                  variant="ghost"
                  colorScheme="light"
                  onPress={props.toggleSidebar}
                  icon={
                    <Icon
                      size="6"
                      name="menu-sharp"
                      as={Ionicons}
                      _light={{ color: "coolGray.50" }}
                      _dark={{ color: "coolGray.50" }}
                    />
                  }
                />

                {colorMode == "light" ? (
                  <Heading size='md' color='coolGray.50'>CapireSoft</Heading>
                ) : (
                  <Heading size='md' color='coolGray.50'>CapireSoft</Heading>
                )}
              </HStack>
              <HStack space="8" alignItems="center">

                <HStack space="5" alignItems="center">
                  <Text
                    fontSize="lg"
                    _dark={{ color: "coolGray.50" }}
                    _light={{ color: "coolGray.50" }}
                  >
                    Hola, Perfil
                  </Text>
                </HStack>

                <Menu
                  closeOnSelect={false}
                  w="190"
                  onOpen={() => console.log("opened")}
                  onClose={() => console.log("closed")}
                  trigger={(triggerProps) => {
                    return (
                      <Pressable {...triggerProps}>
                        <Avatar
                          w="8"
                          h="8"
                          borderWidth="1"
                          _dark={{ borderColor: "primary.700" }}
                          source={{
                            uri: "https://images.pexels.com/photos/1972531/pexels-photo-1972531.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=100",
                          }}
                        />
                      </Pressable>
                    );
                  }}
                >
                  <Menu.Group title="Perfil">
                    <Menu.Item>Cuenta</Menu.Item>
                    <Menu.Item>Facturacion</Menu.Item>
                    <Menu.Item>Seguridad</Menu.Item>
                  </Menu.Group>
                  <Divider mt="3" w="100%" />
                  <Menu.Group title="Admin">
                    <Menu.Item>Configuracion</Menu.Item>
                    <Menu.Item>Cerrar Sesión</Menu.Item>
                  </Menu.Group>
                </Menu>
              </HStack>
            </HStack>
          </Hidden>
        </Box>

        <Box
          flex={1}
          flexDirection={{ base: "column", md: "row" }}
          _light={{
            borderTopColor: "coolGray.200",
          }}
          _dark={{
            bg: "coolGray.800",
            borderTopColor: "coolGray.700",
          }}
        >
          <ScrollView
            flex={1}
            p={{ md: 8 }}
            contentContainerStyle={{
              alignItems: "center",
              flex: 1,
            }}
          >
            <VStack maxW="1016px" flex={1} width="100%">
              <Hidden till="md">
                <HStack mb="4" space={2}>
                  <Pressable>
                    <Icon
                      size="6"
                      as={AntDesign}
                      name={"arrowleft"}
                      _light={{ color: "coolGray.800" }}
                      _dark={{ color: "coolGray.50" }}
                    />
                  </Pressable>
                  <Text
                    fontSize="lg"
                    _dark={{ color: "coolGray.50" }}
                    _light={{ color: "coolGray.800" }}
                  >
                    Titulo Desktop
                  </Text>
                </HStack>
              </Hidden>

              <Stack
                flex={1}
                p={{ md: "8" }}
                _light={{ bg: "white" }}
                _dark={{
                  borderColor: "coolGray.700",
                  bg: { md: "coolGray.900", base: "coolGray.800" },
                }}
                borderWidth={1}
                borderColor="#E5E7EB"
                borderRadius={8}
                direction={{ base: "column", md: "row" }}
                space="6"
              >

                {/* Aqui Contenido  */}



                {/* Cierra contenido */}

              </Stack>
            </VStack>
          </ScrollView>
        </Box>
      </VStack>
    </>
  );
}
