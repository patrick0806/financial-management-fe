"use client";

import { ExpenseChart } from "@/components/expenseChart";
import { FinancialCard } from "@/components/financialCard";
import { ProtectedRoute } from "@/components/protectedRoute";
import { Header } from "@/components/struct/header";
import { TransactionsList } from "@/components/transactionsList";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionType } from "@/types/transaction";

export default function Home() {
  const { data: transactions, isLoading } = useTransactions();
  let totalIncome = 0;
  let totalExpense = 0;

  transactions?.forEach((t) => {
    if (t.type === TransactionType.INCOME) {
      totalIncome += t.value;
    } else {
      totalExpense += t.value;
    }
  });
  return (
    <ProtectedRoute>
      <Header />

      {!isLoading && (
        <div className="mt-5 mx-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FinancialCard
            title="Saldo Atual"
            value={totalIncome - totalExpense}
            type="balance"
            trend={{ value: 12.5, isPositive: true }}
          />
          <FinancialCard
            title="Receitas do Mês"
            value={totalIncome}
            type="income"
            trend={{ value: 8.2, isPositive: true }}
          />
          <FinancialCard
            title="Despesas do Mês"
            value={totalExpense}
            type="expense"
            trend={{ value: 3.1, isPositive: false }}
          />
          <FinancialCard
            title="Economia"
            value={0}
            type="savings"
            trend={{ value: 15.7, isPositive: true }}
          />
        </div>
      )}

      {!isLoading && (
        <div className="mt-5 mx-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExpenseChart
            expenses={
              transactions?.filter((t) => t.type === TransactionType.EXPENSE) ||
              []
            }
          />
          <TransactionsList transactions={transactions || []} />
        </div>
      )}
    </ProtectedRoute>
  );
}
