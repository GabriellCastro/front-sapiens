"use client";

import { FC, useState, useContext, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { validationSchema } from "./validationSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { api } from "@/api";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "@/context/authContext";
import { useFetch } from "@/hooks/useFetch";
import { Loading } from "@/components/Loading";

type ValidationSchema = z.infer<typeof validationSchema>;

interface TransactionProps {
  close: () => void;
  mutate: () => void;
  transactionId: string;
}

export const FormEditAndDeleteTransaction: FC<TransactionProps> = ({
  close,
  mutate,
  transactionId,
}) => {
  const { customer } = useContext(AuthContext);
  const [category, setCategory] = useState("FOOD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const { data: transaction, isLoading } = useFetch<any>(
    `/transaction/id/${transactionId}`
  );

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const handleSave: SubmitHandler<any> = (data) => {
    setIsSubmitting(true);
    const props = {
      amount: Number(data.amount),
      description: data.description,
      date: new Date(data.date).toISOString(),
      category,
      userId: customer.id,
    };

    if (
      props.amount === transaction.data.amount &&
      props.description === transaction.data.description &&
      props.date === transaction.data.date &&
      props.category === transaction.data.category
    ) {
      setIsSubmitting(false);
      close();
      return;
    }

    api
      .patch(`/transaction/${transactionId}`, props)
      .then(() => {
        setIsSubmitting(false);
        toast({
          title: "Transação atualizada com sucesso",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        close();
        reset();
        mutate();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao atualizar transação",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleDelete = () => {
    api
      .delete(`/transaction/${transactionId}`)
      .then(() => {
        toast({
          title: "Transação deletada com sucesso",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        close();
        mutate();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao deletar transação",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const categoryOptions = [
    { value: "FOOD", label: "Alimentação" },
    { value: "TRANSPORT", label: "Transporte" },
    { value: "ENTERTAINMENT", label: "Entretenimento" },
    { value: "OTHER", label: "Outro" },
  ];

  useEffect(() => {
    if (transaction) {
      setValue("amount", String(transaction.data.amount));
      setValue("description", transaction.data.description);
      setValue(
        "date",
        new Date(transaction.data.date).toISOString().split("T")[0]
      );
      setCategory(transaction.data.category);
    }
  }, [transactionId, transaction, setValue]);

  if (isLoading && transactionId) {
    return <Loading large />;
  }

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col w-full"
        onSubmit={handleSubmit(handleSave)}
      >
        <Input
          type="number"
          name="amount"
          description="Digite o valor da transação"
          error={errors.amount?.message}
        />
        <Input
          type="text"
          name="description"
          description="Digite a descrição da transação"
          error={errors.description?.message}
        />
        <Input type="date" name="date" />
        <select
          className="h-full w-full border-none mt-6 p-4"
          onChange={(e) => setCategory(e.target.value)}
          defaultValue={transaction.data.category}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="flex items-center justify-between mt-6">
          <button
            className="h-14 w-full rounded-md bg-red-500 text-white mt-6 font-medium hover:bg-red-600"
            type="button"
            onClick={handleDelete}
          >
            Deletar
          </button>
          <button
            className="h-14 w-full rounded-md bg-[#7C3AED] text-white mt-6 font-medium hover:bg-[#9F67FF]"
            type="submit"
          >
            {isSubmitting ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
