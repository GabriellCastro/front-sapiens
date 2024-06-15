"use client";

import { FC, useState, useContext } from "react";
import { CashRegister, Eye, MagnifyingGlass } from "@phosphor-icons/react";
import { ComplexTable } from "@/components/Table";
import { createColumn } from "react-chakra-pagination";
import { Modal } from "@/components/Modal";
import { CloseButton } from "@chakra-ui/react";
import { FormNewTransaction } from "./@components/FormNewTransaction";
import { useFetch } from "@/hooks/useFetch";
import { AuthContext } from "@/context/authContext";
import { translateCategory } from "@/utils/translateCategory";
import { format } from "date-fns";
import { FormEditAndDeleteTransaction } from "./@components/FormEditAndDeleteTransaction";

const DashboardPage: FC = () => {
  const { customer } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [transactionId, setTransactionId] = useState<string>("");

  const { data: dataTransaction, mutate } = useFetch<any>(
    `/transaction/${customer.id}`
  );

  const transactions = dataTransaction?.data.map((transaction: any) => ({
    amount: transaction.amount.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
    description:
      transaction.description.length > 11
        ? transaction.description.slice(0, 11) + "..."
        : transaction.description,
    date: format(new Date(transaction.date), "dd/MM/yyyy"),
    category: translateCategory(transaction.category),
    action: (
      <Eye
        size={20}
        style={{ color: "#7C3AED" }}
        weight="bold"
        onClick={() => {
          setTransactionId(transaction.id);
          setShowDetails(true);
        }}
        cursor={"pointer"}
      />
    ),
  }));

  const columnHelper = createColumn<(typeof transactions)[]>();

  const columns = [
    columnHelper.accessor("category", {
      cell: (info) => info.getValue(),
      header: "Categoria",
    }),
    columnHelper.accessor("amount", {
      cell: (info) => info.getValue(),
      header: "Valor",
    }),
    columnHelper.accessor("description", {
      cell: (info) => info.getValue(),
      header: "Descrição",
    }),
    columnHelper.accessor("date", {
      cell: (info) => info.getValue(),
      header: "Data",
    }),
    columnHelper.accessor("action", {
      cell: (info) => info.getValue(),
      header: "",
    }),
  ];

  return (
    <>
      <div className="mt-6 container">
        <div
          className="flex items-center 
          sm:flex-row flex-col w-full"
        >
          <button
            type="button"
            className="flex justify-around items-center mr-3 h-12 w-fit p-2 rounded-md bg-green-500 text-white hover:bg-green-600"
            onClick={() => setShowModal(true)}
          >
            <CashRegister
              size={20}
              style={{ color: "white", marginRight: "10px" }}
            />
            <p className="font-medium">Nova transação</p>
          </button>
        </div>
        <ComplexTable
          columns={columns}
          tableData={transactions}
          key={Math.random()}
        />
      </div>
      {showModal && (
        <Modal>
          <div className="flex items-center justify-between w-full h-full">
            <h1 className="text-lg font-medium text-[#7C3AED]">
              Nova transação
            </h1>
            <CloseButton
              onClick={() => setShowModal(false)}
              color={"#7C3AED"}
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full">
            <FormNewTransaction
              close={() => setShowModal(false)}
              mutate={mutate}
            />
          </div>
        </Modal>
      )}
      {showDetails && (
        <Modal>
          <div className="flex items-center justify-between w-full h-full">
            <h1 className="text-lg font-medium text-[#7C3AED]">
              Detalhes da transação
            </h1>
            <CloseButton
              onClick={() => setShowDetails(false)}
              color={"#7C3AED"}
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full">
            <FormEditAndDeleteTransaction
              close={() => setShowDetails(false)}
              mutate={mutate}
              transactionId={transactionId}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default DashboardPage;
