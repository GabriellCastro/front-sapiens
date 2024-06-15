/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { api } from "../api";
import { destroyCookie, parseCookies } from "nookies";
import { usePathname, useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";

import { publicRoutes } from "../utils/routes";

interface IAuthContext {
  customer: any;
  setCustomer: (customer: any) => void;
  signOut: () => void;
}

interface IAuthProvider {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContext);

export const AuthProvider: FC<IAuthProvider> = ({ children }) => {
  const [customer, setCustomer] = useState({});
  const router = useRouter();
  const pathname = usePathname();
  const { token } = parseCookies();

  useEffect(() => {
    if (!token) {
      return;
    }

    api
      .get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }: any) => {
        setCustomer(data.data);
        api.defaults.headers["Authorization"] = `Bearer ${token}`;
        if (pathname === "/dashboard") return;
        if (pathname === "/") router.push("/dashboard");
        if (!publicRoutes.includes(pathname)) return;
        router.push("/dashboard");
      })
      .catch(() => {
        destroyCookie(null, "token");
        router.push("/login");
      });
  }, []);

  useEffect(() => {
    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/login");
      return;
    }
  }, [pathname]);

  const signOut = () => {
    destroyCookie(null, "token");
    setCustomer({});
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        setCustomer,
        signOut,
      }}
    >
      {!token && !publicRoutes.includes(pathname) ? (
        <div
          className="
          flex 
          justify-center 
          items-center 
          min-h-screen
        "
        >
          <Loading large />
        </div>
      ) : (
        <div>{children}</div>
      )}
    </AuthContext.Provider>
  );
};
