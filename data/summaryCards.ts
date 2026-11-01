
import type { SummaryCardData } from "@/types/dashboard";
import { transactions } from "@/data/transactions";
import { calculateFinance } from "@/lib/finance";

const finance = calculateFinance(transactions);

export const summaryCards: readonly SummaryCardData[] = [
  {
    id: "balance",
    title: "Total Balance",
    amount: `$${finance.balance.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    variant: "balance",
  },
  {
    id: "income",
    title: "Income",
    amount: `$${finance.income.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    variant: "income",
  },
  {
    id: "expenses",
    title: "Expenses",
    amount: `$${finance.expenses.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    variant: "expense",
  },
];
