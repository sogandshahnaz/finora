
"use client";

import { useEffect, useState } from "react";
import type { MonthlyBudget } from "@/types/budget";

const STORAGE_KEY = "finora-monthly-budgets";

export function useMonthlyBudgets() {
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load budgets from localStorage
  useEffect(() => {
    try {
      const savedBudgets = localStorage.getItem(STORAGE_KEY);

      if (savedBudgets) {
        const parsed: unknown = JSON.parse(savedBudgets);

        if (Array.isArray(parsed)) {
          setBudgets(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load monthly budgets:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save budgets whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error("Failed to save monthly budgets:", error);
    }
  }, [budgets, isLoaded]);

  function saveBudget(category: string, amount: number) {
    const normalizedCategory = category.trim().toLowerCase();

    setBudgets((currentBudgets) => {
      const existingBudget = currentBudgets.find(
        (budget) =>
          budget.category.trim().toLowerCase() === normalizedCategory,
      );

      if (existingBudget) {
        return currentBudgets.map((budget) =>
          budget.id === existingBudget.id
            ? { ...budget, amount }
            : budget,
        );
      }

      return [
        ...currentBudgets,
        {
          id: crypto.randomUUID(),
          category: category.trim(),
          amount,
        },
      ];
    });
  }

  function deleteBudget(id: string) {
    setBudgets((currentBudgets) =>
      currentBudgets.filter((budget) => budget.id !== id),
    );
  }

  return {
    budgets,
    isLoaded,
    saveBudget,
    deleteBudget,
  };
}
