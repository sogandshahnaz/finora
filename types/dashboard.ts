
export type SummaryCardVariant =
  | "balance"
  | "income"
  | "expense";

export type SummaryCardData = {
  id: string;
  title: string;
  amount: string;
  variant: SummaryCardVariant;
};


export type SummaryCardProps = {
    title: string;
    amount: string;
    variant: SummaryCardVariant;
  };
  