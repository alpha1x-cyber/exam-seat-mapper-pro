
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
}

const PageLayout = ({ children, title }: PageLayoutProps) => {
  const isRTL = document.documentElement.dir === "rtl";

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className={`flex-1 ${isRTL ? 'mr-16 md:mr-64' : 'ml-16 md:ml-64'} transition-all`}>
        <Header title={title} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
