import { Slot } from "expo-router";
import { UserProvider } from "../contexts/UserContext";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/Colors";
import { HabitsProvider } from "../contexts/HabitsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <HabitsProvider>
          <StatusBar style="dark" />
          <Slot />
        </HabitsProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
