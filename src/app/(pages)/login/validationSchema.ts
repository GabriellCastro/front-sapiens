import * as z from "zod";

export const validationSchema = z.object({
  email: z
    .string()
    .min(1, "Campo obrigatório")
    .email("Digite um e-mail válido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});
