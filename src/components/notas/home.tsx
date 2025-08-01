'use client'
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";
import { UsuariosResponse } from "@/types/usuarios/usuarios.response";
import { DataTable, DataTableValueArray } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ActionTypeEnum } from "@/constant/enum/action-type.enum";
import { useRouter } from "next/navigation";
import ProductosForm from "../productos/productos-form";


export default function NotasHome() {
    const [notas, setNotas] = useState<any[]>([]);
    const [tipo, setTipo] = useState<any>(null);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const router = useRouter();
    const dt = useRef<DataTable<any>>(null);
    //TODO add services 

    const initComponent = async () => {
      //LOAD NOTAS & TIPOS //MCP
    };

    useEffect(() => {
      initComponent();
    }, []);

    const exportCSV = () => {
        dt.current?.exportCSV();
    };


    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const statusBodyTemplate = (rowData: UsuariosResponse) => {
        return <Tag value={rowData.estado} severity={getSeverity(rowData)}></Tag>;
    };

    const getSeverity = (rowData: UsuariosResponse) => {
        switch (rowData.estado) {
            case 'INACTIVO':
                return 'danger';

            case 'ACTIVO':
                return 'success';

            case 'OBSERVADO':
                return 'warning';
            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 items-center justify-between">
            <h4 className="m-0">Manage Products</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                 <InputText type="search" placeholder="Search..." onInput={(e) => {const target = e.target as HTMLInputElement; setGlobalFilter(target.value);}}  />
            </IconField>
            <Button label="Añadir" icon="pi pi-plus" className="p-button-help" onClick={()=>router.push('nueva-nota?tipo=VENTA')} />
        </div>
    );

    return (
        <div>
            <div className="card">
                <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={notas}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} notas" globalFilter={globalFilter} header={header}
                >
                    <Column field="nombreCompleto" header="Nombre Completo" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="email" header="Correo" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="telefono" header="Telefono"></Column>
                    <Column field="direccion" header="Direccion" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="dni" header="Dni" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="estado" header="Estado" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
        </div>
    );
}
