import { api } from "@/service/api"
import { Transaction } from "@/types/transaction"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export type CreateTransactionInput = Omit<Transaction, "id" | "groupId">

export async function fetchTransactions(): Promise<Transaction[]> {
  const date = new Date();
  const { data } = await api.get<Transaction[]>(`/v1/transactions?month=${date.getMonth()+1}&year=${date.getFullYear()}`)
  return data
}

export async function createTransaction(
  input: CreateTransactionInput
): Promise<Transaction> {
  const { data } = await api.post<Transaction>("/v1/transactions", input)
  return data
}

export function useTransactions() {
  return useQuery<Transaction[], Error>({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    staleTime: 1000 * 60 * 2, // 2 min de cache
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),
    onSuccess: () => {
      // Recarrega transações do cache
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}