/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 **
 
 */
import { FontAwesome, Ionicons  } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

import Inicio from '../screens/inicio';
import SignUP from '../screens/general/SignUp';

import Proyectos from '../screens/proyectos/verproyectos';
import Inscripciones from '../screens/inscripciones/verinscripciones';
import Avances from '../screens/avances/verAvances';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import RegistrarProyecto from '../screens/proyectos/registrarProyecto';

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
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
      <Stack.Screen name='RegistrarProyecto' component={RegistrarProyecto} options={{ headerShown: true, headerBackVisible: false }} />
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
      />

      <BottomTab.Screen
        name="SignUp"
        component={SignUP}
        options={{
          title: 'Sing Up', 
          tabBarIcon: ({ color }) => <TabBarIcon name="user-o" color={color} />
        }}
        
      /> 
      <BottomTab.Screen
        name="VerProyectos"
        component={Proyectos}
        options={({ navigation }: RootTabScreenProps<'VerProyectos'>) => ({
          title: 'Proyectos',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} /> 
        })}
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





  

