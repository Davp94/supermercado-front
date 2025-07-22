'use client'

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

export default function Dashboard() {
  const { logout, loading, error} = useAuth();
  const router = useRouter();
  const submit = async() => {
    await logout();
    router.push('/login')
  } 
  return (
    <>
        <Button label="LOGOUT" onClick={submit}/>
    </>
  );
}