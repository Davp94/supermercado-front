import { Button } from "primereact/button";
export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <div className="card flex justify-center">
          <Button label="Check" icon="pi pi-check" />
        </div>
        <div className="card flex flex-wrap justify-center gap-3">
          <Button label="Primary" />
          <Button label="Secondary" severity="secondary" />
          <Button label="Success" severity="success" />
          <Button label="Info" severity="info" />
          <Button label="Warning" severity="warning" />
          <Button label="Help" severity="help" />
          <Button label="Danger" severity="danger" />
        </div>
      </div>
    </>
  );
}
