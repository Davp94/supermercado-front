export interface UsuarioRequest {
  id?: number | null;
  email: string;
  fechaNacimiento?: string;
  nombres: string;
  apellidos: string;
  genero: string;
  telefono: string;
  direccion: string;
  dni: string;
  tipoDocumento: string;
  nacionalidad: string;
  rolesIds?: number[];
}