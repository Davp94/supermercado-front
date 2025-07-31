import { MovimientoRequest } from "./movimiento-request";

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
