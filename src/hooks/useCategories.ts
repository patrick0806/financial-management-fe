import { useQuery } from "@tanstack/react-query"
import { api } from "@/service/api"
import { Category } from "@/types/category"

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/v1/categories")
  return data
}

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 minutos em cache
  })
}