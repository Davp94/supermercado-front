"use client";
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";
import { UsuariosResponse } from "@/types/usuarios/usuarios.response";
import {
  DataTable,
  DataTableFilterEvent,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableValueArray,
} from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ActionTypeEnum } from "@/constant/enum/action-type.enum";
import { useRouter } from "next/navigation";
import ProductosForm from "../productos/productos-form";
import { ProductosResponse } from "@/types/inventario/productos.response";
import { SucursalResponse } from "@/types/inventario/sucursal.response";
import { AlmacenResponse } from "@/types/inventario/almacen.response";
import { useInventario } from "@/hooks/useInventario";
import { Dropdown } from "primereact/dropdown";

export default function InventarioHome() {
  const [productos, setProductos] = useState<ProductosResponse[]>([]);
  const [sucursales, setSucursales] = useState<SucursalResponse[]>([]);
  const [almacenes, setAlmacenes] = useState<AlmacenResponse[]>([]);
  const [productosDialog, setProductosDialog] = useState<boolean>(false);
  const [selectedSucursal, setSelectedSucursal] =
    useState<SucursalResponse | null>(null);
  const [selectedAlmacen, setSelectedAlmacen] =
    useState<AlmacenResponse | null>(null);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [flagAction, setFlagAction] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);

  const [lazyState, setLazyState] = useState({
    pageNumber: 1,
    pageSize: 10,
    sortField: "",
    sortOrder: "ASC" as "ASC" | "DESC",
  });

  const {
    getAlmacenes,
    getSucursales,
    getProductosPagination,
    addProductoToAlmacen,
  } = useInventario();

  const initComponent = async () => {
    try {
      const sucursalesData = await getSucursales();
      setSucursales(sucursalesData);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Rejected",
        detail: "Error al recuperar sucursales",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    initComponent();
  }, []);

  useEffect(() => {
    const fetchAlmacenes = async () => {
      if (selectedSucursal?.id) {
        try {
          const almacenesData = await getAlmacenes(selectedSucursal.id);
          setAlmacenes(almacenesData);
          setSelectedAlmacen(null);
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: "Rejected",
            detail: "Error al recuperar almacenes",
            life: 3000,
          });
        }
      } else {
        setAlmacenes([]);
        setSelectedAlmacen(null);
        setProductos([]);
        setTotalRecords(0);
      }
    };
    fetchAlmacenes();
  }, [selectedSucursal]);

  const fetchProducts = async () => {
    if (selectedAlmacen?.id) {
      try {
        const productsData = await getProductosPagination({
          ...lazyState,
          almacenId: selectedAlmacen.id,
          filterValue: globalFilter || null,
        });
        setProductos(productsData.content);
        setTotalRecords(productsData.totalElements);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Rejected",
          detail: "Error al recuperar productos",
          life: 3000,
        });
      }
    } else {
      setProductos([]);
      setTotalRecords(0);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedAlmacen, lazyState, globalFilter]);

  const onPageChange = (event: DataTablePageEvent) => {
    setLazyState({
      ...lazyState,
      pageNumber: event.page ? event.page + 1 : 1,
      pageSize: event.rows,
    });
  };

  const onSort = (event: DataTableSortEvent) => {
    setLazyState({
      ...lazyState,
      sortField: event.sortField,
      sortOrder: event.sortOrder === 1 ? "ASC" : "DESC",
    });
  };

  const openNew = () => {
    setFlagAction(ActionTypeEnum.CREATE);
    setSubmitted(false);
    setProductosDialog(true);
  };

  const hideDialog = (updateData?: boolean) => {
    if (updateData) {
      initComponent();
    }
    setSubmitted(false);
    setProductosDialog(false);
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Nuevo producto"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Stock"
          icon="pi pi-plus"
          severity="info"
          onClick={() => router.push("nueva-nota?tipo=COMPRA")}
        />
      </div>
    );
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

  const statusBodyTemplate = (rowData: UsuariosResponse) => {
    return <Tag value={rowData.estado} severity={getSeverity(rowData)}></Tag>;
  };

  const actionBodyTemplate = (rowData: UsuariosResponse) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => console.log("")}
        />
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          className="mr-2"
          onClick={() => console.log("")}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => console.log("")}
        />
      </>
    );
  };

  const getSeverity = (rowData: UsuariosResponse) => {
    switch (rowData.estado) {
      case "INACTIVO":
        return "danger";

      case "ACTIVO":
        return "success";

      case "OBSERVADO":
        return "warning";
      default:
        return null;
    }
  };

  const header = (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <h4 className="m-0">Manage Products</h4>
      <div className="flex gap-4 items-center">
        <Dropdown
          value={selectedSucursal}
          onChange={(e) => setSelectedSucursal(e.value)}
          options={sucursales}
          optionLabel="nombre"
          placeholder="Seleccione una sucursal"
          className="w-full md:w-14rem"
        />
        <Dropdown
          value={selectedAlmacen}
          onChange={(e) => setSelectedAlmacen(e.value)}
          options={almacenes}
          optionLabel="nombre"
          placeholder="Seleccione un almacen"
          className="w-full md:w-14rem"
        />
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
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={productos}
          dataKey="id"
          paginator
          rows={lazyState.pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
          globalFilter={globalFilter}
          header={header}
          lazy
          totalRecords={totalRecords}
          onPage={onPageChange}
          onSort={onSort}
          sortField={lazyState.sortField}
          sortOrder={lazyState.sortOrder === "ASC" ? 1 : -1}
        >
          <Column
            field="nombre"
            header="NOmbre"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="codigoBarra"
            header="Codigo"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="descripcion"
            header="Descripcion"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="marca"
            header="Marca"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="nombreCategoria"
            header="Categoria"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="precio"
            header="Precio"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "6rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productosDialog}
        header="Productos Form"
        modal
        className="p-fluid"
        onHide={hideDialog}
        style={{ width: "60vw" }}
        closable={false}
      >
        {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(
          flagAction
        ) && <ProductosForm />}
      </Dialog>
    </div>
  );
}
