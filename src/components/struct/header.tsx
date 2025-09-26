"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/hooks/useAuth";
import { TransactionType } from "@/types/transaction";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { TransactionModal } from "../modals/transactionModal";

export function Header() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultType, setDefaultType] = useState(TransactionType.EXPENSE);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
          FinanceApp
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setIsModalOpen(true);
              setDefaultType(TransactionType.EXPENSE);
            }}
            className="bg-primary hover:bg-primary/25"
          >
            <Plus className="h-4 w-4 mr-2" />
            Transação
          </Button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        defaultType={defaultType}
      />
    </header>
  );
}
