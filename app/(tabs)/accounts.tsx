import { View, StyleSheet } from "react-native";
import React, { useLayoutEffect } from "react";
import {
  Text,
  List,
  Divider,
  useTheme,
  Switch,
  Avatar,
  TextInput,
  Button,
  IconButton,
} from "react-native-paper";
import { useThemeContext } from "@/context/ThemeContext";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function AccountScreen() {
  const { colors } = useTheme();
  const { toggleTheme, isDark } = useThemeContext();
  const navigation = useNavigation();

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [editMode, setEditMode] = useState(false);

  const initial = name.charAt(0).toUpperCase();

  const handleSave = () => {
    setEditMode(false);
    // optional: persist changes
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        !editMode && (
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => setEditMode(true)}
          />
        ),
    });
  }, [navigation, editMode]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.profileContainer}>
        <Avatar.Text size={64} label={initial} />
        {editMode ? (
          <>
            <TextInput
              mode="outlined"
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button
              mode="contained"
              onPress={handleSave}
              style={{ marginTop: 8 }}
              contentStyle={{ paddingVertical: 6 }}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </>
        )}
      </View>

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
    paddingHorizontal: 16,
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
  input: {
    width: "100%",
    marginTop: 12,
  },
  settingsContainer: {
    paddingHorizontal: 16,
  },
});
