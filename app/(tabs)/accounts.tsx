import { View, StyleSheet, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useLayoutEffect, useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeContext } from "@/context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

export default function AccountScreen() {
  const { colors } = useTheme();
  const { toggleTheme, isDark } = useThemeContext();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date(0, 0, 0, 21, 0)); // default 9 PM
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    (async () => {
      const enabled = await AsyncStorage.getItem("reminderEnabled");
      const storedTime = await AsyncStorage.getItem("reminderTime");

      if (enabled === "true") setReminderEnabled(true);
      if (storedTime) setReminderTime(new Date(storedTime));
    })();
  }, []);

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  useEffect(() => {
    const loadUserData = async () => {
      const storedName = await AsyncStorage.getItem("user_name");
      const storedEmail = await AsyncStorage.getItem("user_email");

      if (storedName) setName(storedName);
      else setName("John Doe");

      if (storedEmail) setEmail(storedEmail);
      else setEmail("john.doe@example.com");
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const loadReminderSetting = async () => {
      const value = await AsyncStorage.getItem("dailyReminder");
      setDailyReminderEnabled(value === "true");
    };
    loadReminderSetting();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem("user_name", name);
    await AsyncStorage.setItem("user_email", email);
    setEditMode(false);
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

  const handleTimeChange = async (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (selectedDate) {
      setReminderTime(selectedDate);
      await AsyncStorage.setItem("reminderTime", selectedDate.toISOString());
      if (reminderEnabled) scheduleNotification(selectedDate);
    }
    setShowTimePicker(false);
  };

  const handleToggleReminder = async (value: boolean) => {
    setReminderEnabled(value);
    await AsyncStorage.setItem("reminderEnabled", value.toString());

    if (value) {
      scheduleNotification(reminderTime);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const scheduleNotification = async (time: Date) => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💸 Time to update your expenses!",
        body: "Don’t forget to log today’s expenses.",
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      } as any,
    });
  };

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
            title="Daily Reminder"
            left={() => <List.Icon icon="bell-outline" />}
            right={() => (
              <Switch
                value={reminderEnabled}
                onValueChange={handleToggleReminder}
              />
            )}
          />

          {reminderEnabled && (
            <List.Item
              title={`Reminder Time: ${reminderTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
              left={() => <List.Icon icon="clock-outline" />}
              onPress={() => setShowTimePicker(true)}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          )}
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
