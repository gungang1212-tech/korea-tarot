import { ReactNode } from "react";
import Header from "./Header";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: Props) {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <Header />
      <main className={`pt-16 ${className}`}>{children}</main>
    </div>
  );
}
