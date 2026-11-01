
import type { Transaction } from "@/types/transaction";

export function calculateFinance(transactions: readonly Transaction[]) {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expenses;

  return {
    income,
    expenses,
    balance,
  };
}
