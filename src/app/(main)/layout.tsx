import "../globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import { useState } from "react";
import { Menu } from 'primereact/menu';
import { MenuItem } from "primereact/menuitem";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { logout, loading, error} = useAuth();
  const router = useRouter();
  const navigationItems = [
    { name: 'Home', href: '/', icon: 'pi pi-home'},
    { name: 'Usuarios', href: '/usuarios', icon: 'pi pi-user'},
    { name: 'Roles', href: '/roles', icon: 'pi pi-shield'},
    { name: 'Inventario', href: '/', icon: 'pi pi-key'},
    { name: 'Notas', href: '/', icon: 'pi pi-home'},
  ];
  const [sidebarVisible, setSidebarVisible] = useState(false);
  let items: MenuItem[] = [
     {
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => {
              alert('OPEN PROFILE');
            }
        },
         {
            label: 'Logout',
            icon: 'pi pi-user',
            command: () => {
              logout();
              router.push('/login')
            }
        },
  ]
  return (
    <>
      <div></div>
    </>
  )
}
