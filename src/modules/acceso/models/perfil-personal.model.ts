export interface ClienteResponse {
  idCliente: number;
  idUsuario: number;
  nit: string;
  razonSocial: string;
  fechaNacimiento: string;
  puntosFidelidad: number;
  nivelCliente: string;
  observaciones: string;
}

export interface EmpleadoResponse {
  idEmpleado: number;
  idUsuario: number;
  codigoEmpleado: string;
  salario: number;
  fechaContratacion: string;
  fechaFinalizacion?: string;
}

export interface ProveedorResponse {
  idProveedor: number;
  idUsuario: number;
  empresa: string;
  nit: string;
  nombreContacto: string;
  telefonoContacto: string;
  correoContacto: string;
  categoriaProducto: string;
}

export interface PerfilPersonalResponse {
  idUsuario: number;
  ci: string;
  nombre: string;
  apellido: string;
  username: string;
  telefono: string;
  sexo: string;
  correo: string;
  direccion: string;
  fechaRegistro: string;
  cliente?: ClienteResponse;
  empleado?: EmpleadoResponse;
  proveedor?: ProveedorResponse;
}

export interface PerfilPersonalUpdate {
  nombre: string;
  apellido: string;
  telefono: string;
  sexo: string;
  correo: string;
  direccion: string;
}

export interface CambioPasswordRequest {
  passwordActual: string;
  passwordNuevo: string;
}
