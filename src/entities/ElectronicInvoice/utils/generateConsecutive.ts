export function generateConsecutive(lastNumber: number) {
  const tipoComprobante = '001';    // 001 = Factura Electrónica
  const puntoVenta = '00001';       // Tu punto de venta
  const terminal = '01';            // Terminal
  const tipoDocumento = '01';       // 01 Normal
  const number = String(lastNumber + 1).padStart(10, '0');
  
  return tipoComprobante + puntoVenta + terminal + tipoDocumento + number;
}