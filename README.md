# Finora — Personal Finance Dashboard

A modern, responsive personal finance dashboard built with **Next.js, TypeScript, and Tailwind CSS**. Finora helps users track transactions, monitor their financial activity, manage monthly budgets, and visualize spending habits through a clean and intuitive interface.

🌙 Dark Mode · 🌍 English & Persian · 📊 Financial Analytics · 💰 Budget Management


🌐 Live Demo: https://finora-ten-theta.vercel.app/
💻 GitHub Repository: https://github.com/sogandshahnaz/finora
---

## Overview

Finora is a frontend-focused personal finance dashboard designed to make everyday money management simpler and more organized.

The application provides tools for tracking income and expenses, analyzing spending patterns, setting category-based monthly budgets, and managing recurring transactions.

It features a responsive interface, persistent browser storage, bilingual support, and a customizable appearance.

## Features

### Dashboard
- Overview of total balance, income, and expenses.
- Dynamic financial summary cards.
- Monthly income and expense visualization.
- Recent transaction overview.

### Transaction Management
- Add, edit, and delete transactions.
- Support for income and expense transactions.
- Categorize financial activities.
- Search transactions by title or category.
- Filter transactions by type and category.
- Sort transactions by date and amount.
- Paginated transaction list.
- View detailed transaction information.
- Export transaction data as CSV.

### Analytics
- Monthly income and expense charts.
- Expense breakdown by category.
- Category-based spending percentages.
- Identification of the highest spending category.
- Financial insights based on transaction history.
- Average expense and monthly spending comparisons.

### Monthly Budgets
- Create monthly budgets for individual categories.
- Edit and delete existing budgets.
- Track spending against budget limits.
- Visual progress indicators.
- Warnings when spending approaches or exceeds a budget.
- Overview of total budget and remaining amount.

### Recurring Transactions
- Create recurring income and expense entries.
- Support different recurrence frequencies.
- Edit, pause, resume, and delete recurring transactions.
- Automatically process due occurrences when the transactions page is opened.

### User Experience
- Responsive layout for different screen sizes.
- Light and dark themes.
- English and Persian language support.
- RTL and LTR layout support.
- Persistent language and appearance preferences.
- Toast notifications for user actions.
- Transaction details modal with keyboard and backdrop dismissal.
- Custom Finora favicon.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework |
| React 19 | UI library |
| TypeScript | Static typing |
| Tailwind CSS 4 | Styling |
| Recharts 3 | Financial charts and visualizations |
| Lucide React | Icons |
| next-themes | Theme management |
| Sonner | Toast notifications |
| localStorage | Client-side data persistence |

---

## Project Structure

```text
finora/
├── app/
│   ├── (dashboard)/
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── transactions/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── icon.svg
│   └── layout.tsx
│
├── components/
│   ├── dashboard/
│   │   ├── AddTransactionForm.tsx
│   │   ├── EditTransactionForm.tsx
│   │   ├── ExpenseBreakdown.tsx
│   │   ├── ExpenseChart.tsx
│   │   ├── ExportTransactionsButton.tsx
│   │   ├── FinancialInsights.tsx
│   │   ├── MonthlyBudget.tsx
│   │   ├── RecurringTransactions.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── TransactionDetailsModal.tsx
│   │   ├── TransactionItem.tsx
│   │   └── TransactionTable.tsx
│   │
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   │
│   └── providers/
│       ├── LanguageProvider.tsx
│       ├── ThemeProvider.tsx
│       └── ToastProvider.tsx
│
├── data/
│   ├── chartData.ts
│   ├── summaryCards.ts
│   └── transactions.ts
│
├── hooks/
│   ├── useMonthlyBudgets.ts
│   ├── useRecurringTransactions.ts
│   └── useTransactions.ts
│
├── i18n/
│   └── translations.ts
│
├── lib/
│   ├── finance.ts
│   └── utils.ts
│
├── types/
│   ├── budget.ts
│   ├── dashboard.ts
│   ├── recurring-transaction.ts
│   └── transaction.ts
│
├── package.json
└── README.md
```

---

## Getting Started

Follow these steps to run Finora locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (compatible with Next.js 16).
- npm.
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/sogandshahnaz/finora.git
```

### 2. Navigate to the project directory

```bash
cd finora
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Visit:

```text
http://localhost:3000
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint |

To test the production build:

```bash
npm run build
npm run start
```

---

## Data Persistence

Finora currently uses the browser's **localStorage** for client-side data persistence.

The application stores:
- Transactions
- Monthly budgets
- Recurring transaction settings
- User preferences such as language and theme

This allows user data to remain available after refreshing the page in the same browser.

**Important:** Finora does not currently use a backend, database, authentication system, or real bank integration. Data is stored locally in the browser and is not synchronized across devices.

Recurring transactions are processed when the transactions page is opened. They are not processed in the background while the application is closed.

---

## Internationalization

Finora supports two languages:

- English (LTR)
- Persian (RTL)

The interface direction and translated labels adapt to the selected language.

---

## Theme Support

Finora includes light and dark themes, allowing users to switch between appearances according to their preference.

The selected theme is persisted between visits.

---

## CSV Export

Users can export their transaction data in CSV format.

The export functionality includes proper CSV escaping and UTF-8 BOM support to improve compatibility with spreadsheet applications, including Excel.

---

## Deployment

Finora can be deployed using platforms that support Next.js applications.

A convenient option is [Vercel](https://vercel.com/).

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Keep the default Next.js build settings.
4. Deploy the application.

No environment variables are currently required for the frontend functionality.

---

## Future Improvements

Potential areas for further development include:

- Backend integration and database persistence.
- User authentication and personal accounts.
- Cloud synchronization across devices.
- Advanced financial reports and insights.
- More flexible budget periods.
- Automated recurring transaction scheduling.
- Additional currencies and exchange-rate support.

---

## License

No license has been specified for this repository yet.

---

## Author

**Celine**

GitHub: [@sogandshahnaz](https://github.com/sogandshahnaz)

---

<p align="center">
  Built with care using Next.js, TypeScript, and Tailwind CSS.
</p>