"use client";

import { ExpenseChart } from "@/components/expenseChart";
import { Header } from "@/components/struct/header";
import { TransactionsList } from "@/components/transactionsList";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionType } from "@/types/transaction";

export default function Home() {
  const { data: transactions, isLoading } = useTransactions();
  return (
    <div>
      <Header />
      <div className="mt-5 px-5 w-full">
        {!isLoading && (
          <div className="flex flex-row gap-5 justify-around">
            <ExpenseChart
              expenses={
                transactions?.filter(
                  (t) => t.type === TransactionType.EXPENSE
                ) || []
              }
            />
            <TransactionsList transactions={transactions || []} />
          </div>
        )}
      </div>
    </div>
  );
}
