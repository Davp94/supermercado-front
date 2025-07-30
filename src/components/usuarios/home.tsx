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
import UsuariosView from "./view";
import UsuariosForm from "./form";

export default function UsuariosHome() {
  // const { getUsuarios, loading } = useUsuarios();
  // const initComponent = async () => {
  //   const usuarios = await getUsuarios();
  //   console.log("🚀 ~ initComponent ~ usuarios:", usuarios)
  //   setUsuarios(await getUsuarios());
  // };
  // useEffect(() => {
  //   initComponent();
  // }, []);

  // return (
  //   <>
  //       {loading && <p>Cargando...</p>}
  //       {!loading && <p>{JSON.stringify(usuarios)}</p>}
  //   </>
  // );
    const [usuarios, setUsuarios] = useState<UsuariosResponse[]>([]);
    const [usuariosDialog, setUsuariosDialog] = useState<boolean>(false);
    const [usuario, setUsuario] = useState<UsuariosResponse | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [flagAction, setFlagAction] = useState<number>(0);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const { getUsuarios, loading } = useUsuarios();

    const initComponent = async () => {
      const usuarios = await getUsuarios();
      setUsuarios(usuarios);
    };

    useEffect(() => {
      initComponent();
    }, []);

    const openNew = () => {
      setFlagAction(ActionTypeEnum.CREATE);
      setSubmitted(false);
      setUsuariosDialog(true);
    };

    const hideDialog = (updateData?: boolean) => {
        console.log("🚀 ~ hideDialog ~ updateData:", updateData);
        if(updateData){
            initComponent();
        }
        setUsuario(null);
        setSubmitted(false);
        setUsuariosDialog(false);
    };

    const editUsuario = (usuario: UsuariosResponse) => {
        setFlagAction(ActionTypeEnum.UPDATE);
        setUsuario({ ...usuario });
        setUsuariosDialog(true);
    };

    const viewUsuario = (usuario: UsuariosResponse) => {
        setFlagAction(ActionTypeEnum.READ);
        setUsuario({ ...usuario });
        setUsuariosDialog(true);
    };

    const confirmDeleteUsuario = (usuario: UsuariosResponse) => {
     confirmDialog({
            message: 'Esta seguro de borrar el usuario?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => deleteUsuario(usuario),
            reject
        });
    };

    const reject = () => {
        toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }

    const deleteUsuario = (usuario: UsuariosResponse) => {
      //TODO add delete usuario service on hook
      toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      initComponent();
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
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
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-eye" rounded outlined className="mr-2" onClick={() => viewUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUsuario(rowData)} />
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

                <DataTable ref={dt} value={usuarios}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios" globalFilter={globalFilter} header={header}
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

            <Dialog visible={usuariosDialog} header="Usuarios Form" modal className="p-fluid" onHide={hideDialog} style={{ width: '60vw' }}  closable={false}>
                {flagAction == ActionTypeEnum.READ && (
                    <UsuariosView usuario={usuario} hideDialog={hideDialog} />
                )}
                {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(flagAction) && (
                    <UsuariosForm 
                        usuario={usuario} 
                        flagAction={flagAction} 
                        toast={toast} 
                        hideDialog={hideDialog}
                    />
                )}
            </Dialog>
            <ConfirmDialog />
        </div>
    );
}
