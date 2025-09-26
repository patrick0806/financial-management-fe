"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Transaction } from "@/types/transaction";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export function ExpenseChart({ expenses }: { expenses: Transaction[] }) {
  const total = expenses.reduce((sum, expense) => sum + expense.value, 0);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const chartConfig = expenses.reduce(
    (config, expense) => ({
      ...config,
      [expense.description.toLowerCase()]: {
        label: expense?.category?.name,
        color: expense?.category?.color,
      },
    }),
    {}
  );

  const pieData = Object.values(
    expenses.reduce((acc, expense) => {
      const key = expense.category?.id || expense.category?.name || "Outros";

      if (!acc[key]) {
        acc[key] = {
          name: expense.category?.name || expense.description,
          value: 0,
          color: expense.category?.color || "#8884d8", // fallback
        };
      }

      acc[key].value += expense.value;
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>)
  );

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <CardTitle>Gastos por Categoria</CardTitle>
        <CardDescription>
          Distribuição das despesas do mês atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percentage = ((data.value / total) * 100).toFixed(1);
                    return (
                      <div className="rounded-lg border bg-background/95 backdrop-blur p-3 shadow-md">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Categoria
                            </span>
                            <span className="font-bold text-foreground">
                              {data.name}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Valor
                            </span>
                            <span className="font-bold text-foreground">
                              {formatCurrency(data.value)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 text-center">
                          <span className="text-sm text-muted-foreground">
                            {percentage}% do total
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={60}
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value, entry) => (
                  <span
                    className="text-sm text-foreground"
                    style={{ color: entry.color }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Total de despesas:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(total)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
