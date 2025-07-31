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


export default function InventarioHome() {
    const [productos, setProductos] = useState<any[]>([]);
    const [productosDialog, setProductosDialog] = useState<boolean>(false);
    const [sucursales, setSucursales] = useState<any>(null);
    const [almacenes, setAlmacenes] = useState<any>(null);

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');

    const [flagAction, setFlagAction] = useState<number>(0);

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    //TODO add services 

    const initComponent = async () => {
      //LOAD ALMACENES, PRODUCTOS, SUCURSALES
    };

    useEffect(() => {
      initComponent();
    }, []);

    const openNew = () => {
      setFlagAction(ActionTypeEnum.CREATE);
      setSubmitted(false);
      setProductosDialog(true);
    };

    const hideDialog = (updateData?: boolean) => {
        if(updateData){
            initComponent();
        }
        setSubmitted(false);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo producto" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Stock" icon="pi pi-plus" severity="info" onClick={()=>router.push('nueva-nota?tipo=COMPRA')} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const statusBodyTemplate = (rowData: UsuariosResponse) => {
        return <Tag value={rowData.estado} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData: UsuariosResponse) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => console.log('')} />
                <Button icon="pi pi-eye" rounded outlined className="mr-2" onClick={() => console.log('')} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => console.log('')} />
            </>
        );
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
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={productos}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos" globalFilter={globalFilter} header={header}
                >
                    <Column field="nombreCompleto" header="Nombre Completo" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="email" header="Correo" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="telefono" header="Telefono"></Column>
                    <Column field="direccion" header="Direccion" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="dni" header="Dni" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="estado" header="Estado" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productosDialog} header="Productos Form" modal className="p-fluid" onHide={hideDialog} style={{ width: '60vw' }}  closable={false}>
                {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(flagAction) && (
                    <ProductosForm 
                
                    />
                )}
            </Dialog>
            <ConfirmDialog />
        </div>
    );
}
