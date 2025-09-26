/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ExpenseChart } from "@/components/expenseChart";
import { FinancialCard } from "@/components/financialCard";
import { ProtectedRoute } from "@/components/protectedRoute";
import { Header } from "@/components/struct/header";
import { TransactionsList } from "@/components/transactionsList";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionType } from "@/types/transaction";
import { addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [transactionsDate, setTransactionsDate] = useState(new Date());
  const {
    data: transactions,
    isLoading,
    refetch,
  } = useTransactions(transactionsDate);
  let totalIncome = 0;
  let totalExpense = 0;

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  useEffect(() => {
    refetch();
  }, [transactionsDate]);

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
      {/* Month Navigation */}
      <div className="mt-5 mx-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTransactionsDate(subMonths(transactionsDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold capitalize">
            {formatMonthYear(transactionsDate)}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTransactionsDate(addMonths(transactionsDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
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
          {/* <FinancialCard
            title="Economia"
            value={0}
            type="savings"
            trend={{ value: 15.7, isPositive: true }}
          /> */}
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
