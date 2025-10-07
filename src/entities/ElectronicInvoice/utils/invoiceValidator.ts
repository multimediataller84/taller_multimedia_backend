import type { TElectroniceInvoice } from "../domain/types/TElectroniceInvoice.js";

export function invoiceValidator(factura: any): factura is TElectroniceInvoice {
  const requirements = ['emisor', 'receptor', 'consecutivo', 'codigoActividad', 'detalles'];
  
  for (const field of requirements) {
    if (!factura[field]) {
      return false;
    }
  }
  
  if (!Array.isArray(factura.detalles) || factura.detalles.length === 0) {
    return false;
  }
  
  return true;
}