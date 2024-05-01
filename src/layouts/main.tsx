import React from "react";
import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";

export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-svh flex-col bg-[radial-gradient(ellipse_farthest-side_at_100%_0%,hsla(333,35%,87%,.4)_10%,hsla(214,53%,92%,.4)_20%,transparent_100%)] bg-fixed dark:bg-[radial-gradient(ellipse_farthest-side_at_100%_0%,hsla(270,70%,41%,.3)_10%,hsla(217,60%,32%,.3)_20%,transparent_100%)] md:pl-[17rem]">
      <Sidebar />
      <Header />
      <div className="container-grid flex-1 py-4">{children}</div>
    </div>
  );
};
