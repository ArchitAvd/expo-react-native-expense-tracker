// context/ExpenseContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Expense } from "@/types/expense";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import uuid from "react-native-uuid";

type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const STORAGE_KEY = "expenses-data";

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    saveExpenses();
  }, [expenses]);

  const loadExpenses = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setExpenses(JSON.parse(json));
    } catch (e) {
      Alert.alert("Error", "Failed to load expenses.");
    }
  };

  const saveExpenses = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      Alert.alert("Error", "Failed to save expenses.");
    }
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = { id: uuid.v4().toString(), ...expense };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updated } : exp))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  return (
    <ExpenseContext.Provider
      value={{ expenses, addExpense, updateExpense, deleteExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenseContext must be used within an ExpenseProvider");
  }
  return context;
};
