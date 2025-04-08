import { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useExpenseContext } from "@/context/ExpenseContext";
import { useRouter } from "expo-router";
import { TextInput, Button, Card, Text, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { en, registerTranslation } from "react-native-paper-dates";
import { format } from "date-fns";

registerTranslation("en", en);

export default function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const router = useRouter();
  const { addExpense } = useExpenseContext();
  const { colors } = useTheme();

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert("Validation Error", "Please enter title and amount");
      return;
    }

    const newExpense = {
      title,
      amount: parseFloat(amount),
      date: date.toISOString(),
    };

    addExpense(newExpense);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text
            variant="titleLarge"
            style={[styles.header, { color: colors.onBackground }]}
          >
            Add New Expense
          </Text>

          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            label="Amount"
            mode="outlined"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={() => setDatePickerVisible(true)}
            style={styles.input}
          >
            {`Date: ${format(date, "MMM d, yyyy")}`}
          </Button>

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
          >
            Save Expense
          </Button>
        </Card.Content>
      </Card>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={datePickerVisible}
        date={date}
        onConfirm={({ date }) => {
          if (date) {
            setDate(date);
          }
          setDatePickerVisible(false);
        }}
        onDismiss={() => setDatePickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  card: {
    borderRadius: 16,
    padding: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
