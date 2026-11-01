
import type {
  SummaryCardProps,
  SummaryCardVariant,
} from "@/types/dashboard";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const cardStyles: Record<
  SummaryCardVariant,
  {
    icon: typeof Wallet;
    amountColor: string;
    iconColor: string;
  }
> = {
  balance: {
    icon: Wallet,
    amountColor: "text-[#111827] dark:text-slate-100",
    iconColor:
      "bg-[#F1F5F9] text-[#475569] dark:bg-slate-700 dark:text-slate-200",
  },

  income: {
    icon: TrendingUp,
    amountColor: "text-[#10B981] dark:text-emerald-400",
    iconColor:
      "bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950 dark:text-emerald-400",
  },

  expense: {
    icon: TrendingDown,
    amountColor: "text-[#F97316] dark:text-orange-400",
    iconColor:
      "bg-[#FFF7ED] text-[#EA580C] dark:bg-orange-950 dark:text-orange-400",
  },
};

export default function SummaryCard({
  title,
  amount,
  variant,
}: SummaryCardProps) {
  const styles = cardStyles[variant];
  const Icon = styles.icon;

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-[#111827]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#64748B] dark:text-slate-400">
          {title}
        </p>

        <div className={`rounded-xl p-2 ${styles.iconColor}`}>
          <Icon size={20} />
        </div>
      </div>

      <h2 className={`mt-3 text-2xl font-bold ${styles.amountColor}`}>
        {amount}
      </h2>
    </div>
  );
}
