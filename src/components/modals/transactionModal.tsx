"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { CalendarIcon, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TransactionType } from "@/types/transaction";
import z from "zod";
import { useCategories } from "@/hooks/useCategories";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType: TransactionType;
}

const transactionSchema = z.object({
  type: z.enum([TransactionType.EXPENSE, TransactionType.INCOME], {
    message: "Tipo é obrigatório",
  }),
  value: z.number().positive(),
  description: z.string().min(1, "Descrição é obrigatória"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  transactionDate: z.date({ message: "Data é obrigatória" }),
  isRecurring: z.boolean().default(false).optional(),
  installments: z
    .number()
    .min(2, "Mínimo 2 parcelas")
    .max(60, "Máximo 60 parcelas")
    .optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function TransactionModal({
  isOpen,
  onClose,
  defaultType,
}: TransactionModalProps) {
  const { user } = useAuth();
  const [transactionType, setTransactionType] =
    useState<TransactionType>(defaultType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: categories } = useCategories();
  const createTransaction = useCreateTransaction();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: defaultType || TransactionType.EXPENSE,
      transactionDate: new Date(),
      value: 0,
      description: "",
      categoryId: "",
    },
  });

  const watchIsRecurring = form.watch("isRecurring");
  const filteredCategories = categories
    ? categories.filter((category) => category.type === transactionType)
    : [];

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      if (!user) {
        toast.error("Usuário não logado");
        return;
      }

      await createTransaction.mutateAsync({
        type: data.type,
        value: data.value,
        description: data.description,
        userId: user.id,
        categoryId: data.categoryId,
        transactionDate: data.transactionDate.toISOString(),
        isRecurring: data.isRecurring ?? false,
        installments: data.installments ?? 0,
        installmentNumber: 0,
      });

      toast.success("Transação criada com sucesso!");
      form.reset(); // reseta o formulário após sucesso
      onClose(); // fecha modal, se quiser
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar transação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {transactionType === TransactionType.INCOME ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            Nova{" "}
            {transactionType === TransactionType.INCOME ? "Receita" : "Despesa"}
          </DialogTitle>
          <DialogDescription>
            Adicione uma nova transação ao seu controle financeiro
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Transaction Type Tabs */}
            <Tabs
              value={transactionType}
              onValueChange={(value) => {
                setTransactionType(value as TransactionType);
                form.setValue("type", value as TransactionType);
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value={TransactionType.INCOME}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Receita
                </TabsTrigger>
                <TabsTrigger
                  value="EXPENSE"
                  className="flex items-center gap-2"
                >
                  <TrendingDown className="h-4 w-4" />
                  Despesa
                </TabsTrigger>
              </TabsList>

              <TabsContent value={transactionType} className="space-y-4 mt-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Supermercado, Salário, Freelance..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="R$"
                          value={
                            field.value
                              ? new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(field.value as unknown as number)
                              : ""
                          }
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^\d]/g, "");
                            const numeric = Number(raw) / 100; // centavos
                            field.onChange(numeric);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "PPP", { locale: ptBR })
                                : "Selecione uma data"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Switches */}
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <FormField
                    control={form.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Transação Recorrente
                          </FormLabel>
                          <FormDescription>
                            Repetir automaticamente
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!watchIsRecurring && (
                    <FormField
                      control={form.control}
                      name="installments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Parcelas (opcional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="2"
                              max="60"
                              placeholder="Ex: 12"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseInt(e.target.value) || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "flex-1 text-white",
                  transactionType === TransactionType.INCOME
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </div>
                ) : (
                  `Adicionar ${
                    transactionType === TransactionType.INCOME
                      ? "Receita"
                      : "Despesa"
                  }`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
