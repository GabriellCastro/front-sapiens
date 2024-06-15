import { SignOut, User } from "@phosphor-icons/react";
import Image from "next/image";
import { FC, useContext } from "react";
import { AuthContext } from "../../context/authContext";

export const Header: FC = () => {
  const { signOut, customer } = useContext(AuthContext);
  return (
    <div
      className="w-full flex items-center justify-between bg-white
      p-4 h-20 border-b-2 
    "
    >
      <Image src={"/logo.svg"} width={180} height={50} alt="logo" />
      <div className="flex items-center">
        <a
          href="#"
          className="text-[#7C3AED] font-medium text-lg mr-4 hover:text-[#9F67FF]"
        >
          {customer.name}
        </a>
        <SignOut
          size={24}
          weight="fill"
          style={{
            cursor: "pointer",
            color: "#7C3AED",
          }}
          onClick={signOut}
        />
      </div>
    </div>
  );
};
