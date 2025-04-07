import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useExpenseContext } from "@/context/ExpenseContext";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button as PaperButton,
  Text,
  useTheme,
} from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

export default function EditExpense() {
  const { id } = useLocalSearchParams();
  const { expenses, updateExpense } = useExpenseContext();
  const router = useRouter();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setNotes(expense.notes ?? "");

      navigation.setOptions({
        title: `Editing ${expense.title}`,
      });
    }
  }, [id]);

  const handleUpdate = () => {
    if (!title || !amount) return;

    updateExpense(id as string, {
      title,
      amount: parseFloat(amount),
      notes,
      date: date.toISOString(),
    });
    router.back();
  };

  const onDismiss = () => {
    setDatePickerVisible(false);
  };

  const onConfirm = ({ date }: { date: Date | undefined }) => {
    if (date) setDate(date);
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.header}>
        Edit Expense
      </Text>

      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Text
        style={{ marginBottom: 8, color: colors.onSurfaceVariant }}
        variant="labelLarge"
      >
        Date: {date.toLocaleDateString()}
      </Text>

      <PaperButton
        mode="outlined"
        onPress={() => setDatePickerVisible(true)}
        style={styles.dateButton}
      >
        Change Date
      </PaperButton>

      <PaperButton
        mode="contained"
        onPress={handleUpdate}
        style={styles.button}
        disabled={!title || !amount}
      >
        Update Expense
      </PaperButton>

      <DatePickerModal
        mode="single"
        visible={datePickerVisible}
        onDismiss={onDismiss}
        date={date}
        onConfirm={onConfirm}
        saveLabel="Save"
        locale="en"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 24,
  },
  button: {
    paddingVertical: 6,
  },
});
