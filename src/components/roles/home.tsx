'use client'
import { DataTable, DataTableValueArray } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ActionTypeEnum } from "@/constant/enum/action-type.enum";
import { RolesResponse } from "@/types/roles/roles-response";
import { useRoles } from "@/hooks/usuarios/useRoles";

export default function RolesHome() {
    const [roles, setRoles] = useState<RolesResponse[]>([]);
    const [rolesDialog, setRolesDialog] = useState<boolean>(false);
    const [rol, setRol] = useState<RolesResponse | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [flagAction, setFlagAction] = useState<number>(0);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const { getRoles, loading } = useRoles();

    const initComponent = async () => {
      const rolesRetrieved = await getRoles();
      setRoles(rolesRetrieved);
    };

    useEffect(() => {
      initComponent();
    }, []);

    const openNew = () => {
      setFlagAction(ActionTypeEnum.CREATE);
      setSubmitted(false);
      setRolesDialog(true);
    };

    const hideDialog = (updateData?: boolean) => {
        console.log("🚀 ~ hideDialog ~ updateData:", updateData);
        if(updateData){
            initComponent();
        }
        setSubmitted(false);
        setRolesDialog(false);
    };

    const editRol = (rol: RolesResponse) => {
        setFlagAction(ActionTypeEnum.UPDATE);
        setRol({ ...rol });
        setRolesDialog(true);
    };

    const viewRol = (rol: RolesResponse) => {
        setFlagAction(ActionTypeEnum.READ);
        setRol({ ...rol });
        setRolesDialog(true);
    };

    const confirmDeleteRol = (rol: RolesResponse) => {
     confirmDialog({
            message: 'Esta seguro de borrar el rol?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => console.log('DELETE ROL'),
            reject
        });
    };

    const reject = () => {
        toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }

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

    const actionBodyTemplate = (rowData: RolesResponse) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editRol(rowData)} />
                <Button icon="pi pi-eye" rounded outlined className="mr-2" onClick={() => viewRol(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteRol(rowData)} />
            </>
        );
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

                <DataTable ref={dt} value={roles}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} roles" globalFilter={globalFilter} header={header}
                >
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="descripcion" header="Descripcion" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="permisos" header="Permisos"></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={rolesDialog} header="Roles Form" modal className="p-fluid" onHide={hideDialog} style={{ width: '60vw' }}>
                {flagAction == ActionTypeEnum.READ && (
                    <></>
                )}
                {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(flagAction) && (
                    <></>
                )}
            </Dialog>
            <ConfirmDialog />
        </div>
    );
}
