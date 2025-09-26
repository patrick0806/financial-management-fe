import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialCardProps {
  title: string;
  value: number;
  type: "balance" | "income" | "expense" | "savings";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading: boolean;
}

const cardConfig = {
  balance: {
    icon: Wallet,
    gradient: "gradient-primary",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  income: {
    icon: TrendingUp,
    gradient: "gradient-success",
    textColor: "text-green-600 dark:text-green-400",
  },
  expense: {
    icon: TrendingDown,
    gradient: "gradient-danger",
    textColor: "text-red-600 dark:text-red-400",
  },
  savings: {
    icon: PiggyBank,
    gradient: "gradient-primary",
    textColor: "text-purple-600 dark:text-purple-400",
  },
};

function FinancialCardSkeleton({
  type,
}: {
  type: "balance" | "income" | "expense" | "savings";
}) {
  const config = cardConfig[type];

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            {/* Title skeleton */}
            <div className="h-4 bg-muted rounded-md w-2/3 animate-pulse" />

            {/* Value skeleton */}
            <div className="h-8 bg-muted rounded-md w-3/4 animate-pulse" />

            {/* Trend skeleton */}
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-8 animate-pulse" />
              <div className="h-4 bg-muted rounded w-20 animate-pulse" />
            </div>
          </div>

          {/* Icon skeleton */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center opacity-50",
              config.gradient
            )}
          >
            <div className="h-6 w-6 bg-white/30 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancialCard({
  title,
  value,
  type,
  trend,
  isLoading,
}: FinancialCardProps) {
  const config = cardConfig[type];
  const Icon = config.icon;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <>
      {isLoading ? (
        <FinancialCardSkeleton type={type} />
      ) : (
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {title}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(value)}</p>
                {trend && (
                  <div className="flex items-center gap-1 text-sm">
                    {trend.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        trend.isPositive ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {trend.value}%
                    </span>
                    <span className="text-muted-foreground">
                      vs mês anterior
                    </span>
                  </div>
                )}
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  config.gradient
                )}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
