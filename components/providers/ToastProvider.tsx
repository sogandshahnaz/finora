
"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function ToastProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={3000}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      expand={false}
      visibleToasts={4}
      gap={10}
      offset={20}
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border shadow-lg backdrop-blur-md",
          title: "text-sm font-semibold",
          description: "text-xs",
          closeButton: "rounded-lg border-0 bg-transparent",
          success: "border-emerald-200 dark:border-emerald-900",
          error: "border-red-200 dark:border-red-900",
        },
      }}
    />
  );
}
