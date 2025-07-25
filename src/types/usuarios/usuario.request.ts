export interface UsuarioRequest {
  email: string;
  fechaNacimiento: string;
  nombres: string;
  apellidos: string;
  genero: string;
  telefono: string;
  direccion: string;
  dni: string;
  tipoDocumento: string;
  nacionalidad: string;
  rolesIds: number[];
}