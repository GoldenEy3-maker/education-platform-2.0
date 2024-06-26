import React from "react";
import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";
import { cn } from "~/libs/utils";

type MainLayoutProps = {
  isContainerOff?: boolean;
} & React.PropsWithChildren;

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isContainerOff,
}) => {
  return (
    // <div className="flex min-h-svh flex-col bg-[radial-gradient(ellipse_farthest-side_at_100%_0%,hsla(333,35%,87%,.4)_10%,hsla(214,53%,92%,.4)_20%,transparent_100%)] bg-fixed dark:bg-[radial-gradient(ellipse_farthest-side_at_100%_0%,hsla(270,70%,41%,.3)_10%,hsla(217,60%,32%,.3)_20%,transparent_100%)] md:pl-[17rem]">
    <div className="flex min-h-svh flex-col md:pl-[17rem]">
      <Sidebar />
      <Header />
      <div
        className={cn("flex-1", {
          "container-grid py-4": !isContainerOff,
        })}
      >
        {children}
      </div>
    </div>
  );
};
