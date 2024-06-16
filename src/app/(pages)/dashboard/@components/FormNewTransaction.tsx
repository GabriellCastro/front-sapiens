"use client";

import { FC, useState, useContext } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { validationSchema } from "./validationSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { api } from "@/api";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "@/context/authContext";

type ValidationSchema = z.infer<typeof validationSchema>;

interface TransactionProps {
  close: () => void;
  mutate: () => void;
  transactionId?: string;
}

export const FormNewTransaction: FC<TransactionProps> = ({ close, mutate }) => {
  const { customer } = useContext(AuthContext);
  const [category, setCategory] = useState("FOOD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const {
    handleSubmit,
    reset,
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

    api
      .post("/transaction", props)
      .then(() => {
        setIsSubmitting(false);
        toast({
          title: "Transação cadastrada com sucesso",
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
          title: "Erro ao cadastrar transação",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const categoryOptions = [
    { value: "FOOD", label: "Alimentação" },
    { value: "TRANSPORT", label: "Transporte" },
    { value: "ENTERTAINMENT", label: "Entretenimento" },
    { value: "OTHER", label: "Outro" },
  ];

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
          className="
          h-full w-full border-none mt-4 p-4
          rounded-md bg-gray-100 text-gray-500 font-medium
          focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          onChange={(e) => setCategory(e.target.value)}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          className="h-14 w-full rounded-md bg-[#7C3AED] text-white mt-6 font-medium hover:bg-[#9F67FF]"
          type="submit"
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </FormProvider>
  );
};
