import profile from "./screens/profile";
import presence from "./screens/Presence";
import Login from "./screens/Login";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WalletProvider } from "./context/Wallet";

import "expo-dev-client"

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<WalletProvider>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
					<Stack.Screen
						name="Profile"
						component={profile}
						options={{ title: "Welcome" }}
					/>
					<Stack.Screen name="Presence" component={presence} />
				</Stack.Navigator>
			</NavigationContainer>
		</WalletProvider>
	);
}
