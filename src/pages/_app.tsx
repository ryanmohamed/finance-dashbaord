import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import "@/styles/globals.css";
import Nav from "@/components/nav";
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <SessionProvider session={session}>
      <Nav />
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  );
};

export default MyApp;
