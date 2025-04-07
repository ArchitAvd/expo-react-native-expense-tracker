import { useRef, useState, useMemo, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import {
  Card,
  Text,
  FAB,
  Snackbar,
  useTheme,
  Modal,
  Portal,
  List,
} from "react-native-paper";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Expense } from "@/types/expense";
import React from "react";

type SortOption = "newest" | "oldest" | "high" | "low";

export default function ExpenseList() {
  const { expenses, deleteExpense, addExpense } = useExpenseContext();
  const router = useRouter();
  const { colors } = useTheme();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [deletedExpense, setDeletedExpense] = useState<Expense | null>(null);
  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});
  const [sortVisible, setSortVisible] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  useFocusEffect(
    useCallback(() => {
      Object.values(swipeableRefs.current).forEach((ref) => {
        if (ref) ref.close();
      });
    }, [])
  );

  const handleSort = (option: SortOption) => {
    setSortOption(option);
    setSortVisible(false);
  };

  const handleUndo = () => {
    if (deletedExpense) {
      addExpense(deletedExpense);
      setDeletedExpense(null);
      setSnackbarVisible(false);
    }
  };

  const handleSwipeOpen = (direction: "left" | "right", item: Expense) => {
    if (direction === "left") {
      router.push(`./edit/${item.id}`);
    } else if (direction === "right") {
      setDeletedExpense(item);
      deleteExpense(item.id);
      setSnackbarVisible(true);
    }
  };

  const sortedExpenses = useMemo(() => {
    const sorted = [...expenses];
    switch (sortOption) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "high":
        return sorted.sort((a, b) => b.amount - a.amount);
      case "low":
        return sorted.sort((a, b) => a.amount - b.amount);
      default:
        return sorted;
    }
  }, [expenses, sortOption]);

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.rowContainer}>
      <Swipeable
        ref={(ref) => {
          swipeableRefs.current[item.id] = ref;
        }}
        onSwipeableOpen={(direction) => handleSwipeOpen(direction, item)}
        renderLeftActions={() => (
          <View style={[styles.swipeAction, styles.rightAction]}>
            <Text style={styles.swipeText}>Edit</Text>
          </View>
        )}
        renderRightActions={() => (
          <View style={[styles.swipeAction, styles.leftAction]}>
            <Text style={styles.swipeText}>Delete</Text>
          </View>
        )}
        overshootLeft={false}
        overshootRight={false}
      >
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="titleMedium" style={styles.title}>
              {item.title}
            </Text>
            <Text variant="bodyMedium" style={styles.amount}>
              ₹ {item.amount.toFixed(2)}
            </Text>
            <Text variant="bodySmall" style={styles.date}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </Card.Content>
        </Card>
      </Swipeable>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {expenses.length > 0 ? (
          <FlatList
            data={sortedExpenses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={renderItem}
          />
        ) : (
          <View style={styles.empty}>
            <Text variant="bodyLarge" style={{ color: colors.onSurface }}>
              No expenses yet 🧾
            </Text>
          </View>
        )}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          action={{
            label: "Undo",
            onPress: handleUndo,
          }}
          duration={3000}
        >
          Expense deleted
        </Snackbar>
      </View>

      <FAB
        icon="sort"
        style={styles.sortFab}
        onPress={() => setSortVisible(true)}
        color="white"
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push("/modals/add")}
      />

      <Portal>
        <Modal
          visible={sortVisible}
          onDismiss={() => setSortVisible(false)}
          contentContainerStyle={styles.bottomSheet}
        >
          <Text variant="titleMedium" style={{ marginBottom: 12 }}>
            Sort Expenses
          </Text>
          <List.Item
            title="Newest First"
            left={() => <List.Icon icon="calendar-arrow-right" />}
            onPress={() => handleSort("newest")}
          />
          <List.Item
            title="Oldest First"
            left={() => <List.Icon icon="calendar-arrow-left" />}
            onPress={() => handleSort("oldest")}
          />
          <List.Item
            title="Highest First"
            left={() => <List.Icon icon="arrow-up-bold" />}
            onPress={() => handleSort("high")}
          />
          <List.Item
            title="Lowest First"
            left={() => <List.Icon icon="arrow-down-bold" />}
            onPress={() => handleSort("low")}
          />
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  rowContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    color: "green",
  },
  date: {
    marginTop: 4,
    color: "#888",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  sortFab: {
    position: "absolute",
    right: 16,
    bottom: 90,
    backgroundColor: "#6200ee", // Primary
  },
  swipeAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  leftAction: {
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "flex-end",
    width: 100,
    paddingRight: 20,
    height: "100%",
  },
  rightAction: {
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 100,
    paddingLeft: 20,
    height: "100%",
  },
  swipeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomSheet: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    position: "absolute",
    bottom: 0,
    width: "90%",
    alignSelf: "center",
  },
});
