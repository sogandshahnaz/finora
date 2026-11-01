
import type { TransactionType } from "@/types/transaction";

export type RecurrenceFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export type RecurringTransaction = {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  startDate: string;
  nextRunDate: string;
  isActive: boolean;
};
