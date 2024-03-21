import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";

export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid min-h-svh grid-cols-[17rem_1fr] grid-rows-[auto_1fr] bg-[radial-gradient(circle_at_bottom_left,rgb(250,232,2261)_10%,rgb(249,225,238)_30%,rgb(216,232,252)_50%,transparent_100%),radial-gradient(circle_at_bottom_right,rgb(115,234,236)_10%,rgb(170,202,244)_30%,rgba(216,232,252,1)_50%,transparent_100%)] bg-fixed dark:bg-[radial-gradient(circle_at_bottom_left,rgb(141,111,172)_10%,rgb(27,165,161)_30%,rgb(36,136,176)_50%,transparent_100%),radial-gradient(circle_at_top_right,rgb(141,111,172)_10%,rgb(27,165,161)_30%,rgb(36,136,176)_50%,transparent_100%)]">
      <Sidebar className="row-span-2" />
      <Header className="col-start-2" />
      <div className="container-grid col-start-2 py-2">{children}</div>
    </div>
  );
};
