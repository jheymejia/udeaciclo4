import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, extendTheme, theme as nbTheme } from "native-base";
import SignUp from "./screens/SignUp"
import SignIn from "./screens/SignIn"
import BasicNav from "./screens/BasicNav"
//import './assets/css/App.css';


const theme = extendTheme({
  colors: {
    primary: nbTheme.colors.cyan,
  },
});

const Drawer = createDrawerNavigator();

export default function App() {
	return (
		<NativeBaseProvider theme={theme}>
			<NavigationContainer>
				<Drawer.Navigator screenOptions={{ headerShown: false }}>					
					<Drawer.Screen name={"SignIn"} component={SignIn} />
					<Drawer.Screen name={"SignUp"} component={SignUp} />					
					<Drawer.Screen name={"BasicNav"} component={BasicNav} />
				</Drawer.Navigator>
			</NavigationContainer>
		</NativeBaseProvider>
	);
}




	

