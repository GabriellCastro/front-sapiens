"use client";

import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { ReactNode, Suspense } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <Suspense fallback={<Loading medium />}>
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </Suspense>
    </div>
  );
}
