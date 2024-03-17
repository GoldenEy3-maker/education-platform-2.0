import dayjs from "dayjs";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import { type NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";
import { Inter } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";

import { api } from "~/libs/api";

import "~/styles/globals.css";

dayjs.locale("ru");
dayjs.extend(relativeTimePlugin);

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>
        <div className={`font-sans ${inter.variable}`}>
          {getLayout(<Component {...pageProps} />)}
        </div>
        <Toaster richColors />
      </SessionProvider>
    </ThemeProvider>
  );
}

export default api.withTRPC(MyApp);
