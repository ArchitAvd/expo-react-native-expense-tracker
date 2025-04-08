import { View, StyleSheet, FlatList } from "react-native";
import { Text, Card, IconButton, useTheme } from "react-native-paper";
import { useExpenseContext } from "@/context/ExpenseContext";
import { useMemo, useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { useThemeContext } from "@/context/ThemeContext";

const AnalysisScreen = () => {
  const { expenses } = useExpenseContext();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { toggleTheme, isDark } = useThemeContext();
  const now = new Date();

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(d.setDate(diff));
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const currentMonthExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const date = new Date(e.date);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });
  }, [expenses]);

  const currentWeekExpenses = useMemo(() => {
    const startOfWeek = getStartOfWeek(now);
    return expenses.filter((e) => {
      const date = new Date(e.date);
      return date >= startOfWeek && date <= now;
    });
  }, [expenses]);

  const todayExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const date = new Date(e.date);
      return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });
  }, [expenses]);

  const totalSpentMonth = useMemo(() => {
    return currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthExpenses]);

  const totalSpentWeek = useMemo(() => {
    return currentWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [currentWeekExpenses]);

  const totalSpentToday = useMemo(() => {
    return todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [todayExpenses]);

  const numOfExpenses = useMemo(
    () => currentMonthExpenses.length,
    [currentMonthExpenses]
  );

  const averageExpense = useMemo(() => {
    return numOfExpenses === 0 ? 0 : totalSpentMonth / numOfExpenses;
  }, [totalSpentMonth, numOfExpenses]);

  const defaultExpense = {
    id: "",
    title: "",
    amount: 0,
    date: new Date().toISOString(),
  };

  const highestExpense = useMemo(() => {
    if (currentMonthExpenses.length === 0) return defaultExpense;
    return currentMonthExpenses.reduce(
      (max, e) => (e.amount > max.amount ? e : max),
      currentMonthExpenses[0]
    );
  }, [currentMonthExpenses]);

  const lowestExpense = useMemo(() => {
    if (currentMonthExpenses.length === 0) return defaultExpense;
    return currentMonthExpenses.reduce(
      (min, e) => (e.amount < min.amount ? e : min),
      currentMonthExpenses[0]
    );
  }, [currentMonthExpenses]);

  const topExpenses = useMemo(() => {
    return [...currentMonthExpenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [currentMonthExpenses]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: colors.onSurface }]}
          >
            Total Spent
          </Text>
          <Text style={{ color: colors.onSurface }}>
            📅 Month: ₹ {totalSpentMonth.toFixed(2)}
          </Text>
          <Text style={{ color: colors.onSurface }}>
            📆 Week: ₹ {totalSpentWeek.toFixed(2)}
          </Text>
          <Text style={{ color: colors.onSurface }}>
            🕒 Today: ₹ {totalSpentToday.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: colors.onSurface }]}
          >
            Expense Stats
          </Text>
          <Text style={{ color: colors.onSurface }}>
            🧾 Number of Expenses: {numOfExpenses}
          </Text>
          <Text style={{ color: colors.onSurface }}>
            💸 Average Expense: ₹ {averageExpense.toFixed(2)}
          </Text>
          <Text style={{ color: colors.onSurface }}>
            ⬆️ Highest: ₹ {highestExpense.amount.toFixed(2)} (
            {highestExpense.title || "—"})
          </Text>
          <Text style={{ color: colors.onSurface }}>
            ⬇️ Lowest: ₹{" "}
            {lowestExpense.amount === Infinity
              ? "0.00"
              : lowestExpense.amount.toFixed(2)}{" "}
            ({lowestExpense.title || "—"})
          </Text>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: colors.onSurface }]}
          >
            Top 3 Expenses
          </Text>
          <FlatList
            data={topExpenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text
                  style={[styles.expenseTitle, { color: colors.onSurface }]}
                >
                  {item.title}
                </Text>
                <Text style={[styles.amount, { color: colors.onSurface }]}>
                  ₹ {item.amount.toFixed(2)}
                </Text>
              </View>
            )}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

export default AnalysisScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  amount: {
    fontWeight: "600",
    color: "#444",
  },
  expenseTitle: {
    color: "#333",
  },
});
