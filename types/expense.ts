export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO string
  notes?: string;
}
