/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

import Inicio from '../screens/inicio';
import SignUp from '../screens/general/SignUp';
import SignIn from '../screens/general/SignIn';

import Proyectos from '../screens/proyectos/verproyectos';
import Inscripciones from '../screens/inscripciones/verinscripciones';
import Avances from '../screens/avances/verAvances';

// import TabOneScreen from '../screens/TabOneScreen';
// import TabTwoScreen from '../screens/TabTwoScreen';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />      
      {/* <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group> */}
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="Inicio"
        component={Inicio}
        options={{
          title: 'Inicio', 
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerLeft: () => (
            
            <Pressable 
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>              
              <FontAwesome
                name="gears"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginLeft: 15 }}
                
              />             
            </Pressable>
          ),
        }}        
        // options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
        //   title: 'Inicio',
        //   tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        //   headerRight: () => (
        //     <Pressable
        //       onPress={() => navigation.navigate('Modal')}
        //       style={({ pressed }) => ({
        //         opacity: pressed ? 0.5 : 1,
        //       })}>
        //       <FontAwesome
        //         name="info-circle"
        //         size={25}
        //         color={Colors[colorScheme].text}
        //         style={{ marginRight: 15 }}
        //       />
        //     </Pressable>
        //   ),
        // })}
      />
      <BottomTab.Screen
        name="VerProyectos"
        component={Proyectos}
        options={{
          title: 'Proyectos',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} /> 
        }}
      />
      <BottomTab.Screen
        name="VerInscripciones"
        component={Inscripciones}
        options={{
          title: 'Inscripciones',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="VerAvances"
        component={Avances}
        options={{
          title: 'Avances',
          tabBarIcon: ({ color }) => <TabBarIcon name="signal" color={color} />,
        }}
        />
      <BottomTab.Screen
        name="SignIn"
        component={SignIn}
        options={{
          title: 'Sign In',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
        />
         {/* <BottomTab.Screen
          name="TabTwo"
          component={TabTwoScreen}
          options={{
            title: 'Tab Two',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }} */}
          

    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
