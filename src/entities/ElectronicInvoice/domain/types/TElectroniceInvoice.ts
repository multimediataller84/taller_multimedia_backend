export type TEmitter = {
  nombre: string;
  nombreComercial: string;
  tipoIdentificacion: string;
  identificacion: string;
  provincia: string;
  canton: string;
  distrito: string;
  direccion: string;
  telefono: string;
  email: string;
};

export type TReceiver = {
  nombre: string;
  tipoIdentificacion: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  provincia_id: number;
  canton_id: number;
  distrito_id: number;
};

export type TTax = {
  codigo: string;
  codigoTarifa: string;
  tarifa: number;
  exoneracion?: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombreInstitucion: string;
    fechaEmision: string;
    porcentaje: number;
    monto: number;
  };
};

export type TCommercialCode = {
  tipo: string;
  codigo: string;
};

export type TLineDetails = {
  codigoComercial: TCommercialCode;
  descripcion: string;
  cantidad: number;
  unidadMedida: string;
  precioUnitario: number;
  descuento?: number;
  naturalezaDescuento?: string;
  impuesto: TTax;
  ivaDevuelto?: number;
  otrosCargos?: number;
};

export type TElectroniceInvoice = {
  consecutivo: string;
  codigoActividad: string;
  emisor: TEmitter;
  receptor: TReceiver;
  condicionVenta: string;
  medioPago: string;
  moneda: string;
  detalles: TLineDetails[];
};
