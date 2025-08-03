"use client";

import { Toast } from "primereact/toast";
import { RefObject, useEffect, useRef, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useRouter } from "next/navigation";
import { useNotas } from "@/hooks/useNotas";
import { NotasRequest } from "@/types/notas/notas-request";
import { useInventario } from "@/hooks/useInventario";
import { ProductosResponse } from "@/types/inventario/productos.response";
import { AlmacenResponse } from "@/types/inventario/almacen.response";
import { UsuariosResponse } from "@/types/usuarios/usuarios.response";
import { useSearchParams } from "next/navigation";
import { EntidadComercialResponse } from "@/types/entidad-comercial.response";

export default function NotasForm() {
  const [tipo] = useState<string[]>(["COMPRA", "VENTA"]);
  const [tiposMovimiento] = useState<string[]>(["ENTRADA", "SALIDA"]);

  // Mock data states
  const [productos, setProductos] = useState<ProductosResponse[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<
    ProductosResponse[]
  >([]);
  const [almacenes, setAlmacenes] = useState<AlmacenResponse[]>([]);
  const [entidadesComerciales, setEntidadesComerciales] = useState<
    EntidadComercialResponse[]
  >([]);
  //TODO get usuario by state
  const [usuario, setUsuario] = useState<UsuariosResponse>();

  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { crearNota, getEntidadesComerciales } = useNotas();
  const { getAlmacenes, getProductosAlmacen } = useInventario();
  const searchParams = useSearchParams();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<NotasRequest>({
    defaultValues: {
      entidadComercialId: 0,
      usuarioId: 1,
      tipoNota: "COMPRA",
      subTotal: 0,
      descuentoTotal: 0,
      totalCalculado: 0,
      observaciones: "",
      movimientos: [
        {
          almacenId: searchParams.get("almacenId") as unknown as number,
          productoId: 0,
          cantidad: 1,
          tipoMovimiento: "INGRESO",
          precioUnitarioCompra: 0,
          precioUnitarioVenta: 0,
          totalLinea: 0,
          observaciones: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "movimientos",
  });

  // Watch for changes to recalculate totals
  const watchedMovimientos = watch("movimientos");
  const watchedDescuento = watch("descuentoTotal");

  // Mock data initialization
  const initForm = async () => {
    const almacenId = searchParams.get("almacenId");
    const productosRetrieved = await getProductosAlmacen(
      almacenId ? +almacenId : 1
    );
    setProductos(productosRetrieved);
    const entidadesComercialesRetrieved = await getEntidadesComerciales();
    setEntidadesComerciales(entidadesComercialesRetrieved);
  };

  // Product autocomplete search
  const searchProducto = (event: any) => {
    const query = event.query.toLowerCase();
    const filtered = productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(query) ||
        producto.codigoBarra.toLowerCase().includes(query)
    );
    setFilteredProductos(filtered);
  };

  // Product selection handler
  const onProductoSelect = (producto: ProductosResponse, index: number) => {
    setValue(`movimientos.${index}.productoId`, producto.id);
    setValue(
      `movimientos.${index}.precioUnitarioCompra`,
      producto.precioVentaActual
    );
    setValue(
      `movimientos.${index}.precioUnitarioVenta`,
      producto.precioVentaActual
    );
    calculateLineTotal(index);
  };

  // Calculate line total
  const calculateLineTotal = (index: number) => {
    console.log("🚀 ~ calculateLineTotal ~ index:", index);
    const movimiento = getValues(`movimientos.${index}`);

    // Convert to numbers and provide defaults
    const cantidad = Number(movimiento.cantidad) || 0;
    const precioUnitario = Number(movimiento.precioUnitarioCompra) || 0;

    console.log("Cantidad:", cantidad, "Precio:", precioUnitario); // Debug log

    const total = cantidad * precioUnitario;
    setValue(`movimientos.${index}.totalLinea`, total);
    calculateTotals();
  };

  // Calculate totals
  const calculateTotals = () => {
    const movimientos = getValues("movimientos");
    console.log("🚀 ~ calculateTotals ~ movimientos:", movimientos);
    const subTotal = movimientos.reduce(
      (sum, mov) => sum + (mov.totalLinea || 0),
      0
    );
    const descuento = getValues("descuentoTotal") || 0;
    const total = subTotal - descuento;

    setValue("subTotal", subTotal);
    setValue("totalCalculado", total);
  };

  // Add new movement
  const addMovimiento = () => {
    append({
      almacenId: searchParams.get("almacenId") as unknown as number,
      productoId: 0,
      cantidad: 1,
      tipoMovimiento: "INGRESO",
      precioUnitarioCompra: 0,
      precioUnitarioVenta: 0,
      totalLinea: 0,
      observaciones: "",
    });
  };

  // Remove movement
  const removeMovimiento = (index: number) => {
    remove(index);
    calculateTotals();
  };

  const onSubmit = async (data: NotasRequest) => {
    try {
      
      await crearNota(data);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Nota creada exitosamente",
        life: 3000,
      });
      reset();
      onCloseForm();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al crear la nota",
        life: 3000,
      });
    }
  };

  const onCloseForm = async () => {
    router.back();
  };

  // Product template for autocomplete
  const productoTemplate = (producto: ProductosResponse) => (
    <div className="flex justify-between items-center p-2">
      <div>
        <div className="font-semibold">{producto.nombre}</div>
        <div className="text-sm text-gray-500">{producto.codigoBarra}</div>
      </div>
      <div className="text-right">
        <div className="text-sm">Precio: ${producto.precioVentaActual}</div>
      </div>
    </div>
  );

  useEffect(() => {
    initForm();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [watchedMovimientos, watchedDescuento]);

  return (
    <>
      <Toast ref={toast} />
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-800 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-2">🏪 Crear Nota</h1>
          <p className="text-blue-100">
            Gestión de Productos y Movimientos de Inventario
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Information */}
          <Card title="📋 Información de la Nota" className="shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Controller
                name="tipoNota"
                control={control}
                rules={{ required: "El campo es requerido" }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    {...field}
                    options={tipo}
                    placeholder="Seleccionar tipo"
                    className="w-full"
                  />
                )}
              />
              <Controller
                name="entidadComercialId"
                control={control}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    {...field}
                    options={entidadesComerciales}
                    optionLabel="razonSocial"
                    optionValue="id"
                    placeholder="Seleccionar entidad comercial"
                    className="w-full"
                  />
                )}
              />

              <Controller
                name="descuentoTotal"
                control={control}
                render={({ field, fieldState }) => (
                  <InputNumber
                    id={field.name}
                    {...field}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="mt-4">
              <Controller
                name="observaciones"
                control={control}
                render={({ field, fieldState }) => (
                  <InputTextarea
                    {...field}
                    rows={3}
                    placeholder="Ingrese observaciones adicionales..."
                    className="w-full"
                  />
                )}
              />
            </div>
          </Card>

          {/* Products Section */}
          <Card
            title="📦 Productos y Movimientos"
            className="shadow-lg"
            subTitle={
              <Button
                type="button"
                label="+ Agregar Producto"
                icon="pi pi-plus"
                onClick={addMovimiento}
                className="p-button-sm mt-2"
              />
            }
          >
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    {/* Product Autocomplete */}
                    <div className="lg:col-span-3">
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Producto <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name={`movimientos.${index}.productoId`}
                        control={control}
                        render={({ field: productField }) => (
                          <AutoComplete
                            value={productos.find(
                              (p) => p.id === productField.value
                            )}
                            suggestions={filteredProductos}
                            completeMethod={searchProducto}
                            field="nombre"
                            placeholder="Buscar producto..."
                            itemTemplate={productoTemplate}
                            onSelect={(e) => onProductoSelect(e.value, index)}
                            className="w-full"
                            dropdown
                          />
                        )}
                      />
                    </div>
                    <div className="lg:col-span-3">
                      <Controller
                        name={`movimientos.${index}.cantidad`}
                        control={control}
                        rules={{ required: "La cantidad es requerida", min: 1 }}
                        render={({ field: productField }) => (
                          <>
                            <InputNumber
                              {...productField}
                              value={field.cantidad}
                              min={1}
                              onChange={(e) => {
                                productField.onChange(e.value);
                                calculateLineTotal(index);
                              }}
                              className="w-full"
                            />
                          </>
                        )}
                      />

                      {/* Unit Price */}
                      <Controller
                        name={`movimientos.${index}.precioUnitarioCompra`}
                        control={control}
                        render={({ field: productField }) => (
                          <InputNumber
                            {...productField}
                            mode="currency"
                            currency="USD"
                            locale="en-US"
                            className="w-full"
                          />
                        )}
                      />

                      {/* Line Total */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          Total Línea
                        </label>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 font-bold text-center">
                          $
                          {watch(`movimientos.${index}.totalLinea`)?.toFixed(
                            2
                          ) || "0.00"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <Controller
                      name={`movimientos.${index}.observaciones`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Observaciones..."
                          className="w-full"
                        />
                      )}
                    />

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        icon="pi pi-trash"
                        severity="danger"
                        size="small"
                        onClick={() => removeMovimiento(index)}
                        className="mt-6"
                        tooltip="Eliminar producto"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Summary Section */}
          <Card
            title="📊 Resumen de la Nota"
            className="shadow-lg bg-gradient-to-r from-gray-50 to-blue-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Subtotal</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${watch("subTotal")?.toFixed(2) || "0.00"}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Descuento</div>
                <div className="text-2xl font-bold text-orange-600">
                  ${watch("descuentoTotal")?.toFixed(2) || "0.00"}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Total Final</div>
                <div className="text-2xl font-bold text-green-600">
                  ${watch("totalCalculado")?.toFixed(2) || "0.00"}
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <Button
              type="button"
              label="Cancelar"
              severity="secondary"
              icon="pi pi-times"
              className="md:w-auto w-full"
              onClick={onCloseForm}
            />
            <Button
              type="submit"
              label="Guardar Nota"
              icon="pi pi-save"
              className="md:w-auto w-full"
            />
          </div>
        </form>
      </div>
    </>
  );
}
