"use client";

import { Input } from "@/components/Input";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import Image from "next/image";
import { FC, useContext, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { validationSchema } from "./validationSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { api } from "@/api";
import { AuthContext } from "@/context/authContext";
import { setCookie } from "nookies";
import { useToast } from "@chakra-ui/react";

type ValidationSchema = z.infer<typeof validationSchema>;

const LoginPage: FC = () => {
  const { setCustomer } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleLogin: SubmitHandler<ValidationSchema> = async (data, e) => {
    e?.preventDefault();
    try {
      setIsSubmitting(true);
      const { data: response } = await api.post("/auth/login", data);
      setCookie(null, "token", response.data.token);
      setCustomer(response.data.user);
      toast({
        title: "Login efetuado com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro ao efetuar login",
        description: "Verifique suas credenciais e tente novamente",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
        <div className="flex flex-col items-start mt-16 w-7/12">
          <h1 className="text-4xl font-bold mb-4 ">Acesse a plataforma</h1>
          <p>
            Faça login ou registre-se para começar a construir seus projetos
            ainda hoje.
          </p>
        </div>
        <FormProvider {...methods}>
          <form
            className="flex flex-col w-7/12 mt-8"
            onSubmit={handleSubmit(handleLogin)}
          >
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
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
            <p className=" mt-6">
              Ainda não tem uma conta?{" "}
              <a
                href="#"
                className="text-[#7C3AED] font-bold hover:underline"
                onClick={() => router.push("/register")}
              >
                Inscreva-se
              </a>
            </p>
          </form>
        </FormProvider>
      </div>
      <div
        className="bg-image bg-cover bg-center bg-no-repeat hidden sm:block"
        style={{
          backgroundImage: "url(login.svg)",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default LoginPage;
