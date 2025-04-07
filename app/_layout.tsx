import { SafeAreaProvider } from "react-native-safe-area-context";
import { ExpenseProvider } from "../context/ExpenseContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider, useThemeContext } from "@/context/ThemeContext";

export default function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <ExpenseProvider>
            <StatusBar backgroundColor="black" barStyle="light-content" />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modals/add"
                options={{ presentation: "modal", title: "Add Expense" }}
              />
            </Stack>
          </ExpenseProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
