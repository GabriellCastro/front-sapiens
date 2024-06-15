"use client";

import { Input } from "@/components/Input";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import Image from "next/image";
import { FC, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { validationSchema } from "./validationSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { api } from "@/api";

type ValidationSchema = z.infer<typeof validationSchema>;

const RegisterPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleRegister: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      setIsSubmitting(true);
      await api.post("/auth/register", data);
      push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:lg:grid flex min-h-screen grid-cols-2 justify-center">
      <div className="flex flex-col items-center">
        <div className="flex items-start py-14 w-7/12">
          <Image src="logo.svg" width={200} height={50} alt="Sapiens Logo" />
        </div>
        <div className="flex flex-col items-start mt-10 w-7/12">
          <h1 className="text-4xl font-bold mb-4 ">Cadastre na plataforma</h1>
          <p>Faça login ou registre-se para começar a gereciar suas finanças</p>
        </div>
        <FormProvider {...methods}>
          <form
            className="flex flex-col w-7/12 mt-8"
            onSubmit={handleSubmit(handleRegister)}
          >
            <Input
              placeholder="Nome"
              name="name"
              description="Digite seu nome"
              error={errors.name?.message?.toString()}
            />
            <Input
              placeholder="E-mail"
              name="email"
              description="Digite seu e-mail"
              error={errors.email?.message?.toString()}
            />
            <Input
              placeholder="Password"
              name="password"
              description="Digite sua senha"
              forgotPassword
              type={showPassword ? "text" : "password"}
              icon={
                showPassword ? (
                  <Eye
                    size={20}
                    weight="regular"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      cursor: "pointer",
                      color: "#94A3B8",
                      backgroundColor: "white",
                      marginRight: "10px",
                    }}
                  />
                ) : (
                  <EyeSlash
                    size={20}
                    weight="regular"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      cursor: "pointer",
                      color: "#94A3B8",
                      backgroundColor: "white",
                      marginRight: "10px",
                    }}
                  />
                )
              }
              error={errors.password?.message?.toString()}
            />
            <button
              className="h-12 w-full rounded-md bg-[#7C3AED] text-white mt-6 font-bold hover:bg-[#9F67FF]"
              type="submit"
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar-se"}
            </button>
            <p className=" mt-6">
              Já tem uma conta?{" "}
              <a
                href="#"
                className="text-[#7C3AED] font-bold hover:underline"
                onClick={() => push("/login")}
              >
                Faça login
              </a>
            </p>
          </form>
        </FormProvider>
      </div>
      <div
        className="bg-cover bg-center bg-no-repeat hidden sm:block"
        style={{
          backgroundImage: "url(login.svg)",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default RegisterPage;
