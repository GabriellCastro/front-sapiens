import * as z from "zod";

export const validationSchema = z.object({
  amount: z.string().min(1, "Campo obrigatório"),
  description: z.string().min(3, "Campo obrigatório"),
  date: z.string().min(1, "Campo obrigatório"),
});
