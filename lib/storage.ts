import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "expenses";

export const getExpenses = async () => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveExpenses = async (expenses: any[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};
