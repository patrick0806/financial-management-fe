import { api } from "@/service/api"
import { Transaction } from "@/types/transaction"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

type CreateTransactionInput = Omit<Transaction, "id" | "groupId">

async function fetchTransactions(transactionDate: Date): Promise<Transaction[]> {
  console.log(transactionDate);
  const { data } = await api.get<Transaction[]>(`/v1/transactions?month=${transactionDate.getMonth()+1}&year=${transactionDate.getFullYear()}`)
  return data
}

async function createTransaction(
  input: CreateTransactionInput
): Promise<Transaction> {
  const { data } = await api.post<Transaction>("/v1/transactions", input)
  return data
}

async function deleteTransaction(transactionId: string, deleteRecurring: boolean = false, deleteInstallments: boolean = false){
    await api.delete<void>(`/v1/transactions/${transactionId}?deleteRecurring=${deleteRecurring}&deleteInstallments=${deleteInstallments}`);
}

export function useTransactions(transactionDate: Date) {
  return useQuery<Transaction[], Error>({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(transactionDate),
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


export function useDeleteTransaction(){
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({transactionId, deleteRecurring, deleteInstallments }:{transactionId: string, deleteRecurring: boolean , deleteInstallments: boolean}) => {
        return deleteTransaction(transactionId, deleteRecurring, deleteInstallments);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] })
      },
    })
}