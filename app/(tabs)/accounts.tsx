import { View, StyleSheet } from "react-native";
import {
  Text,
  List,
  Divider,
  useTheme,
  Switch,
  Avatar,
} from "react-native-paper";
import { useThemeContext } from "@/context/ThemeContext";
import { useState } from "react";

export default function AccountScreen() {
  const { colors } = useTheme();
  const { toggleTheme, isDark } = useThemeContext();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Avatar.Icon size={64} icon="account" />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        <List.Section>
          <List.Subheader style={{ color: colors.onBackground }}>
            Preferences
          </List.Subheader>

          <List.Item
            title="Dark Mode"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <Switch value={isDark} onValueChange={toggleTheme} />}
          />
          <Divider />

          <List.Item
            title="About"
            description="App version 1.0.0"
            left={() => <List.Icon icon="information-outline" />}
            onPress={() => {}}
          />
        </List.Section>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  email: {
    color: "#888",
    fontSize: 14,
  },
  settingsContainer: {
    paddingHorizontal: 16, // 👈 add horizontal padding to fix the spacing
  },
});
