import Head from "next/head";

type MainLayoutProps = {
  title?: string;
} & React.PropsWithChildren;

export const ScaffoldLayout: React.FC<MainLayoutProps> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title ?? "Образовательный портал АГУ"}</title>
        <meta name="description" content="Образовательный портал АГУ" />
        <meta
          name="keywords"
          content="Образовательный портал АГУ, АГУ, Портал АГУ, Образовательный портал, Портал, Образовательный"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-svh flex-col overflow-x-hidden">
        {children}
      </div>
    </>
  );
};
