export interface TInvoiceResult {
  success: boolean;
  clave: string;
  mensaje: string;
  respuestaHacienda: any;
  xmlPath?: string;
  firma?: string;
}