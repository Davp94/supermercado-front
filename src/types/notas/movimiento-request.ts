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