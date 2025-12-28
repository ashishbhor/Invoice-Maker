import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./src/types";

import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ClientDetailsScreen from "./src/screens/ClientDetailsScreen";
import EventSelectionScreen from "./src/screens/EventSelectionScreen";
import ServicesScreen from "./src/screens/ServicesScreen";
import PreviewScreen from "./src/screens/PreviewScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import { InvoiceProvider } from "./src/context/InvoiceContext";
import 'react-native-gesture-handler';
import 'react-native-screens';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <InvoiceProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ClientDetails" component={ClientDetailsScreen} />
          <Stack.Screen name="EventSelection" component={EventSelectionScreen} />
          <Stack.Screen name="Services" component={ServicesScreen} />
          <Stack.Screen name="Preview" component={PreviewScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </InvoiceProvider>
  );
}
