"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// Define a type for the component's props
interface Props {
  children: ReactNode;
}

const ClientProvider = ({ children }: Props) => {
  return (
    // Wrap the children with the SessionProvider to manage session state
    <SessionProvider>{children}</SessionProvider>
  );
};

export default ClientProvider;
