import Head from "next/head";

type ScaffoldLayoutProps = {
  title?: string;
} & React.PropsWithChildren;

export const ScaffoldLayout: React.FC<ScaffoldLayoutProps> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title ?? "Образовательный портал АГУ"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Образовательный портал АГУ" />
        <meta
          name="keywords"
          content="Образовательный портал АГУ, АГУ, Портал АГУ, Образовательный портал, Портал, Образовательный"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex min-h-svh flex-col">{children}</div>
    </>
  );
};
