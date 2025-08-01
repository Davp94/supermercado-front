'use client'

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

// Interfaces
export interface NotasRequest {
  entidadComercialId: number;
  usuarioId: number;
  tipoNota: string;
  subTotal: number;
  descuentoTotal: number;
  totalCalculado: number;
  observaciones: string;
  movimientos: MovimientoRequest[];
}

export interface MovimientoRequest {
  almacenId: number;
  productoId: number;
  cantidad: number;
  tipoMovimiento: string;
  precioUnitarioCompra: number;
  precioUnitarioVenta: number;
  totalLinea: number;
  observaciones: string;
}

// Mock data interfaces
interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  precioCompra: number;
  precioVenta: number;
}

interface Almacen {
  id: number;
  nombre: string;
}

interface EntidadComercial {
  id: number;
  nombre: string;
  tipo: string;
}

interface Usuario {
  id: number;
  nombre: string;
}

// InputController component (assuming it's a wrapper for form inputs)
const InputController = ({ 
  name, 
  control, 
  label, 
  errors, 
  children, 
  required = false,
  className = "" 
}: any) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label htmlFor={name} className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => children(field)}
    />
    {errors[name] && (
      <small className="text-red-500">{errors[name].message}</small>
    )}
  </div>
);

export default function NotasForm() {
  const [tipo] = useState<string[]>(['COMPRA', 'VENTA']);
  const [tiposMovimiento] = useState<string[]>(['ENTRADA', 'SALIDA']);
  
  // Mock data states
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [entidadesComerciales, setEntidadesComerciales] = useState<EntidadComercial[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { crearNota } = useNotas();

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
      usuarioId: 0,
      tipoNota: 'COMPRA',
      subTotal: 0,
      descuentoTotal: 0,
      totalCalculado: 0,
      observaciones: '',
      movimientos: [{
        almacenId: 0,
        productoId: 0,
        cantidad: 1,
        tipoMovimiento: 'ENTRADA',
        precioUnitarioCompra: 0,
        precioUnitarioVenta: 0,
        totalLinea: 0,
        observaciones: ''
      }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "movimientos"
  });

  // Watch for changes to recalculate totals
  const watchedMovimientos = watch("movimientos");
  const watchedDescuento = watch("descuentoTotal");

  // Mock data initialization
  const initForm = async () => {
    // Mock productos
    const mockProductos: Producto[] = [
      { id: 1, nombre: "Bananas Orgánicas", codigo: "PROD001", precioCompra: 2.50, precioVenta: 3.50 },
      { id: 2, nombre: "Leche Entera 1L", codigo: "PROD002", precioCompra: 3.99, precioVenta: 4.99 },
      { id: 3, nombre: "Pan Integral", codigo: "PROD003", precioCompra: 2.25, precioVenta: 3.25 },
      { id: 4, nombre: "Arroz Blanco 1Kg", codigo: "PROD004", precioCompra: 1.80, precioVenta: 2.80 },
      { id: 5, nombre: "Aceite de Oliva 500ml", codigo: "PROD005", precioCompra: 8.50, precioVenta: 12.99 },
      { id: 6, nombre: "Pollo Fresco 1Kg", codigo: "PROD006", precioCompra: 5.99, precioVenta: 8.99 },
      { id: 7, nombre: "Tomates Frescos 1Kg", codigo: "PROD007", precioCompra: 2.20, precioVenta: 3.20 },
      { id: 8, nombre: "Pasta Italiana 500g", codigo: "PROD008", precioCompra: 1.50, precioVenta: 2.50 }
    ];

    // Mock almacenes
    const mockAlmacenes: Almacen[] = [
      { id: 1, nombre: "Almacén Principal" },
      { id: 2, nombre: "Sección Lácteos" },
      { id: 3, nombre: "Sección Frutas y Verduras" },
      { id: 4, nombre: "Productos Congelados" }
    ];

    // Mock entidades comerciales
    const mockEntidades: EntidadComercial[] = [
      { id: 1, nombre: "Fresh Foods Inc.", tipo: "PROVEEDOR" },
      { id: 2, nombre: "Distribuidora Global", tipo: "PROVEEDOR" },
      { id: 3, nombre: "Granjas Locales Co.", tipo: "PROVEEDOR" },
      { id: 4, nombre: "Cliente Premium", tipo: "CLIENTE" }
    ];

    // Mock usuarios
    const mockUsuarios: Usuario[] = [
      { id: 1, nombre: "Juan Pérez - EMP001" },
      { id: 2, nombre: "María García - EMP002" },
      { id: 3, nombre: "Carlos Rodríguez - EMP003" }
    ];

    setProductos(mockProductos);
    setAlmacenes(mockAlmacenes);
    setEntidadesComerciales(mockEntidades);
    setUsuarios(mockUsuarios);

    // Set default values
    setValue("usuarioId", 1);
    setValue("entidadComercialId", 1);
  };

  // Product autocomplete search
  const searchProducto = (event: any) => {
    const query = event.query.toLowerCase();
    const filtered = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(query) ||
      producto.codigo.toLowerCase().includes(query)
    );
    setFilteredProductos(filtered);
  };

  // Product selection handler
  const onProductoSelect = (producto: Producto, index: number) => {
    setValue(`movimientos.${index}.productoId`, producto.id);
    setValue(`movimientos.${index}.precioUnitarioCompra`, producto.precioCompra);
    setValue(`movimientos.${index}.precioUnitarioVenta`, producto.precioVenta);
    calculateLineTotal(index);
  };

  // Calculate line total
  const calculateLineTotal = (index: number) => {
    const movimiento = getValues(`movimientos.${index}`);
    const total = movimiento.cantidad * movimiento.precioUnitarioCompra;
    setValue(`movimientos.${index}.totalLinea`, total);
    calculateTotals();
  };

  // Calculate totals
  const calculateTotals = () => {
    const movimientos = getValues("movimientos");
    const subTotal = movimientos.reduce((sum, mov) => sum + (mov.totalLinea || 0), 0);
    const descuento = getValues("descuentoTotal") || 0;
    const total = subTotal - descuento;

    setValue("subTotal", subTotal);
    setValue("totalCalculado", total);
  };

  // Add new movement
  const addMovimiento = () => {
    append({
      almacenId: 0,
      productoId: 0,
      cantidad: 1,
      tipoMovimiento: 'ENTRADA',
      precioUnitarioCompra: 0,
      precioUnitarioVenta: 0,
      totalLinea: 0,
      observaciones: ''
    });
  };

  // Remove movement
  const removeMovimiento = (index: number) => {
    remove(index);
    calculateTotals();
  };

  const onSubmit = async (data: NotasRequest) => {
    try {
      console.log('Submitting data:', data);
      // await crearNota(data);
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
  const productoTemplate = (producto: Producto) => (
    <div className="flex justify-between items-center p-2">
      <div>
        <div className="font-semibold">{producto.nombre}</div>
        <div className="text-sm text-gray-500">{producto.codigo}</div>
      </div>
      <div className="text-right">
        <div className="text-sm">Compra: ${producto.precioCompra}</div>
        <div className="text-sm">Venta: ${producto.precioVenta}</div>
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-2">🏪 Crear Nota de Venta</h1>
          <p className="text-blue-100">Gestión de Productos y Movimientos de Inventario</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Information */}
          <Card title="📋 Información de la Nota" className="shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InputController
                name="tipoNota"
                control={control}
                label="Tipo de Nota"
                errors={errors}
                required
              >
                {(field: any) => (
                  <Dropdown
                    {...field}
                    options={tipo}
                    placeholder="Seleccionar tipo"
                    className="w-full"
                  />
                )}
              </InputController>

              <InputController
                name="entidadComercialId"
                control={control}
                label="Entidad Comercial"
                errors={errors}
                required
              >
                {(field: any) => (
                  <Dropdown
                    {...field}
                    options={entidadesComerciales}
                    optionLabel="nombre"
                    optionValue="id"
                    placeholder="Seleccionar entidad"
                    className="w-full"
                  />
                )}
              </InputController>

              <InputController
                name="usuarioId"
                control={control}
                label="Usuario"
                errors={errors}
                required
              >
                {(field: any) => (
                  <Dropdown
                    {...field}
                    options={usuarios}
                    optionLabel="nombre"
                    optionValue="id"
                    placeholder="Seleccionar usuario"
                    className="w-full"
                  />
                )}
              </InputController>

              <InputController
                name="descuentoTotal"
                control={control}
                label="Descuento Total"
                errors={errors}
              >
                {(field: any) => (
                  <InputNumber
                    {...field}
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    className="w-full"
                  />
                )}
              </InputController>
            </div>

            <div className="mt-4">
              <InputController
                name="observaciones"
                control={control}
                label="Observaciones"
                errors={errors}
              >
                {(field: any) => (
                  <InputTextarea
                    {...field}
                    rows={3}
                    placeholder="Ingrese observaciones adicionales..."
                    className="w-full"
                  />
                )}
              </InputController>
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
                <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    {/* Product Autocomplete */}
                    <div className="lg:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Producto <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name={`movimientos.${index}.productoId`}
                        control={control}
                        render={({ field: productField }) => (
                          <AutoComplete
                            value={productos.find(p => p.id === productField.value)}
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

                    {/* Warehouse */}
                    <InputController
                      name={`movimientos.${index}.almacenId`}
                      control={control}
                      label="Almacén"
                      errors={errors}
                    >
                      {(field: any) => (
                        <Dropdown
                          {...field}
                          options={almacenes}
                          optionLabel="nombre"
                          optionValue="id"
                          placeholder="Seleccionar"
                          className="w-full"
                        />
                      )}
                    </InputController>

                    {/* Quantity */}
                    <InputController
                      name={`movimientos.${index}.cantidad`}
                      control={control}
                      label="Cantidad"
                      errors={errors}
                    >
                      {(field: any) => (
                        <InputNumber
                          {...field}
                          value={field.value}
                          onValueChange={(e) => {
                            field.onChange(e.value);
                            setTimeout(() => calculateLineTotal(index), 0);
                          }}
                          min={1}
                          className="w-full"
                        />
                      )}
                    </InputController>

                    {/* Unit Price */}
                    <InputController
                      name={`movimientos.${index}.precioUnitarioCompra`}
                      control={control}
                      label="Precio Compra"
                      errors={errors}
                    >
                      {(field: any) => (
                        <InputNumber
                          {...field}
                          value={field.value}
                          onValueChange={(e) => {
                            field.onChange(e.value);
                            setTimeout(() => calculateLineTotal(index), 0);
                          }}
                          mode="currency"
                          currency="USD"
                          locale="en-US"
                          className="w-full"
                        />
                      )}
                    </InputController>

                    {/* Line Total */}
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">Total Línea</label>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 font-bold text-center">
                        ${watch(`movimientos.${index}.totalLinea`)?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <InputController
                      name={`movimientos.${index}.observaciones`}
                      control={control}
                      label="Observaciones del producto"
                      errors={errors}
                      className="flex-1 mr-4"
                    >
                      {(field: any) => (
                        <InputText
                          {...field}
                          placeholder="Observaciones..."
                          className="w-full"
                        />
                      )}
                    </InputController>

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
          <Card title="📊 Resumen de la Nota" className="shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Subtotal</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${watch("subTotal")?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Descuento</div>
                <div className="text-2xl font-bold text-orange-600">
                  ${watch("descuentoTotal")?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Total Final</div>
                <div className="text-2xl font-bold text-green-600">
                  ${watch("totalCalculado")?.toFixed(2) || '0.00'}
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