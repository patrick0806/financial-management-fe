import { Category } from "./category"

export enum TransactionType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}

export type Transaction = {
  id: string,
  groupId: string,
  type: string,
  value: number,
  description: string,
  userId: string,
  categoryId: string,
  category?: Category,
  transactionDate: string,
  isRecurring: boolean,
  installments: number,
  installmentNumber: number
}