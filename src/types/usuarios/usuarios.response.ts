export interface UsuariosResponse {
  id: number | null;
  email: string;
  fechaNacimiento?: string;
  nombreCompleto: string;
  nombres: string;
  apellidos: string;
  genero: string;
  telefono: string;
  direccion: string;
  dni: string;
  tipoDocumento: string;
  nacionalidad: string;
  estado: string;
  roles?: string[];
}
