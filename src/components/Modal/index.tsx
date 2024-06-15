import { FC } from "react";

interface Props {
  children: React.ReactNode;
}

export const Modal: FC<Props> = ({ children }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70
        sm:bg-opacity-50 z-50
      "
    >
      <div
        className="bg-white px-8 py-8 rounded-lg md:w-4/12
        sm:w-12/12
      "
      >
        {children}
      </div>
    </div>
  );
};
