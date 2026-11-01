
import type { Transaction } from "@/types/transaction";

export const transactions: readonly Transaction[] = [
  {
    id: "txn-001",
    title: "Grocery Shopping",
    category: "Food",
    date: "2026-10-28",
    amount: 85.5,
    type: "expense",
  },
  {
    id: "txn-002",
    title: "Monthly Salary",
    category: "Salary",
    date: "2026-10-27",
    amount: 3200,
    type: "income",
  },
  {
    id: "txn-003",
    title: "Coffee",
    category: "Food & Drinks",
    date: "2026-10-26",
    amount: 6.5,
    type: "expense",
  },
  {
    id: "txn-004",
    title: "Freelance Project",
    category: "Freelance",
    date: "2026-10-25",
    amount: 450,
    type: "income",
  },
];
