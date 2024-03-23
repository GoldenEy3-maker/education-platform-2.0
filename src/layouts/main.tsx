import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";

export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid min-h-svh grid-cols-[1fr] grid-rows-[auto_1fr] bg-[radial-gradient(ellipse_farthest-side_at_100%_0%,hsla(333,35%,87%,.4)_10%,hsla(214,53%,92%,.4)_20%,transparent_100%)] bg-fixed dark:bg-[radial-gradient(ellipse_farthest-side_at_100%_0%,hsla(270,70%,41%,.3)_10%,hsla(217,60%,32%,.3)_20%,transparent_100%)] md:grid-cols-[17rem_1fr]">
      <Sidebar className="row-span-2" />
      <Header className="col-start-2" />
      <div className="container-grid col-start-2 py-2">{children}</div>
    </div>
  );
};
