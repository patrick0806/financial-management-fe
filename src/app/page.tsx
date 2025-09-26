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
import { addMonths, format, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [transactionsDate, setTransactionsDate] = useState(new Date());
  const currentMonthKey = useMemo(
    () => format(transactionsDate, "yyyy-MM"),
    [transactionsDate]
  );

  const nextMonthDate = useMemo(
    () => addMonths(transactionsDate, 1),
    [transactionsDate]
  );

  const nextMonthKey = useMemo(
    () => format(nextMonthDate, "yyyy-MM"),
    [nextMonthDate]
  );

  const {
    data: transactions,
    isLoading,
    refetch,
  } = useTransactions(transactionsDate, currentMonthKey);

  const {
    data: nextMonthTransactions,
    isLoading: isLoadingNextMount,
    refetch: refetchNextMonth,
  } = useTransactions(nextMonthDate, nextMonthKey);

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  useEffect(() => {
    refetch();
    refetchNextMonth();
  }, [transactionsDate]);

  const { totalIncome, totalExpense } = useMemo(() => {
    if (!transactions) return { totalIncome: 0, totalExpense: 0 };

    return transactions.reduce(
      (acc, t) => {
        if (t.type === TransactionType.INCOME) {
          acc.totalIncome += t.value;
        } else {
          acc.totalExpense += t.value;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
  }, [transactions]);

  const nextMonthExpenses = useMemo(() => {
    if (!nextMonthTransactions) return 0;

    return nextMonthTransactions.reduce((acc, t) => {
      if (t.type === TransactionType.EXPENSE) {
        return acc + t.value;
      }
      return acc;
    }, 0);
  }, [nextMonthTransactions]);

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
      <div className="mt-5 mx-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialCard
          title="Saldo Atual"
          value={totalIncome - totalExpense}
          type="balance"
          trend={{ value: 12.5, isPositive: true }}
          isLoading={isLoading}
        />
        <FinancialCard
          title="Receitas do Mês"
          value={totalIncome}
          type="income"
          trend={{ value: 8.2, isPositive: true }}
          isLoading={isLoading}
        />
        <FinancialCard
          title="Despesas do Mês"
          value={totalExpense}
          type="expense"
          trend={{ value: 3.1, isPositive: false }}
          isLoading={isLoading}
        />

        <FinancialCard
          title="Contas do próximo Mês"
          value={nextMonthExpenses || 0}
          type="savings"
          trend={{ value: 15.7, isPositive: true }}
          isLoading={isLoadingNextMount}
        />
      </div>

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
