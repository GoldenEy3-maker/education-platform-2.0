import dayjs from "dayjs";
import "dayjs/locale/ru";
import durationPlugin from "dayjs/plugin/duration";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import { type NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";
import { Inter, Montserrat, Open_Sans } from "next/font/google";
import { useIsomorphicLayoutEffect } from "usehooks-ts";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";

import { api } from "~/libs/api";

import "~/styles/globals.css";

dayjs.locale("ru");
dayjs.extend(relativeTimePlugin);
dayjs.extend(durationPlugin);

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

  useIsomorphicLayoutEffect(() => {
    document.body.classList.add("font-sans", inter.variable);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
        <Toaster richColors />
      </SessionProvider>
    </ThemeProvider>
  );
}

export default api.withTRPC(MyApp);
