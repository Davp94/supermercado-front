"use client";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import { useRouter } from "next/navigation";
import { NotasResponse } from "@/types/notas/notas-response";
import { useNotas } from "@/hooks/useNotas";

export default function NotasHome() {
  const [notas, setNotas] = useState<NotasResponse[]>([]);
  const [tipo, setTipo] = useState<any>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const router = useRouter();
  const dt = useRef<DataTable<any>>(null);
  const { getNotas } = useNotas();
  const toast = useRef<Toast>(null);
  const initComponent = async () => {
    try {
      const notasRetrieved = await getNotas();
      setNotas(notasRetrieved);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obneter las notas",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    initComponent();
  }, []);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const statusBodyTemplate = (rowData: NotasResponse) => {
    return (
      <Tag value={rowData.estadoNota} severity={getSeverity(rowData)}></Tag>
    );
  };

  const getSeverity = (rowData: NotasResponse) => {
    switch (rowData.estadoNota) {
      case "INACTIVO":
        return "danger";

      case "REGISTRADO":
        return "success";

      case "OBSERVADO":
        return "warning";
      default:
        return null;
    }
  };

  const header = (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <h4 className="m-0">Notas De Compra/venta</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search..."
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setGlobalFilter(target.value);
          }}
        />
      </IconField>
      <Button
        label="Añadir"
        icon="pi pi-plus"
        className="p-button-help"
        onClick={() => router.push("nueva-nota?tipo=VENTA")}
      />
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

        <DataTable
          ref={dt}
          value={notas}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} notas"
          globalFilter={globalFilter}
          header={header}
        >
          <Column
            field="codigoNota"
            header="Codigo"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="fechaEmision"
            header="Fecha Emision"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column field="tipoNota" header="Tipo Nota"></Column>
          <Column
            field="estadoNota"
            header="Estado"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="observaciones"
            header="Observaciones"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
