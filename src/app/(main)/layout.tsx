import "../globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div> {children}</div>;
}
