export type LineInput = {
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxPercentage?: number | null; 
  taxExempt?: boolean;

  ivaDevuelto?: number;
  otrosCargos?: number;
};

export type RawDetalle = {
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  naturalezaDescuento?: string;

  impuesto?: {
    codigo?: string;
    codigoTarifa?: string;
    tarifa?: number;
    exoneracion?: {
      tipoDocumento: string;
      numeroDocumento: string;
      nombreInstitucion: string;
      fechaEmision: string;
      porcentaje: number;
      monto: number;
    } | null;
  } | null;

  unidadMedida?: string;
  descripcion?: string;

  ivaDevuelto?: number;
  otrosCargos?: number;
};

export type LineCalc = {
  netBeforeTax: number; 
  taxRate: number;
  taxAmount: number;
  lineTotal: number;

  lineaSubtotal: number;
  montoDescuento: number;
  subtotalConDescuento: number;
  montoImpuesto: number;
  montoIvaDevuelto: number;
  montoOtrosCargos: number;
  montoTotalLinea: number;

  isGravado: boolean;
  isExento: boolean;
};

export function round2(n: number) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}
export function round5(n: number) {
  return Math.round((Number(n) + Number.EPSILON) * 100000) / 100000;
}
const toNum = (x: any, def = 0) => (Number.isFinite(Number(x)) ? Number(x) : def);

function normalize(input: LineInput | RawDetalle): LineInput {
  if ("quantity" in input && "unitPrice" in input) {
    return {
      quantity: toNum(input.quantity),
      unitPrice: toNum(input.unitPrice),
      discount: toNum((input as any).discount, 0),
      taxPercentage:
        input.taxExempt ? 0 : toNum((input as any).taxPercentage, null as any),
      taxExempt: !!input.taxExempt,
      ivaDevuelto: toNum((input as any).ivaDevuelto, 0),
      otrosCargos: toNum((input as any).otrosCargos, 0),
    };
  }

  const d = input as RawDetalle;
  const tarifa = d?.impuesto?.tarifa;
  const exento = !tarifa || tarifa <= 0;

  return {
    quantity: toNum(d.cantidad),
    unitPrice: toNum(d.precioUnitario),
    discount: toNum(d.descuento, 0),
    taxPercentage: exento ? 0 : toNum(tarifa, 0),
    taxExempt: exento,
    ivaDevuelto: toNum(d.ivaDevuelto, 0),
    otrosCargos: toNum(d.otrosCargos, 0),
  };
}

export function calcLine(input: LineInput | RawDetalle): LineCalc {
  const l = normalize(input);

  const qty = toNum(l.quantity, 0);
  const price = toNum(l.unitPrice, 0);
  const disc = Math.max(toNum(l.discount, 0), 0);

  const lineaSubtotal = round5(qty * price);
  const subtotalConDescuento = round5(Math.max(lineaSubtotal - disc, 0));

  let taxRate = 0;
  if (!l.taxExempt && l.taxPercentage != null) {
    const p = Number(l.taxPercentage);
    if (Number.isFinite(p) && p > 0) taxRate = p / 100;
  }

  const montoImpuesto = round5(subtotalConDescuento * taxRate);
  const montoIvaDevuelto = round5(toNum(l.ivaDevuelto, 0));
  const montoOtrosCargos = round5(toNum(l.otrosCargos, 0));

  const montoTotalLinea = round5(
    subtotalConDescuento + montoImpuesto + montoOtrosCargos - montoIvaDevuelto
  );

  const isGravado = taxRate > 0;
  const isExento = taxRate === 0;

  return {
    netBeforeTax: round2(subtotalConDescuento),
    taxRate,
    taxAmount: round2(montoImpuesto),
    lineTotal: round2(montoTotalLinea),

    lineaSubtotal,
    montoDescuento: round5(disc),
    subtotalConDescuento,
    montoImpuesto,
    montoIvaDevuelto,
    montoOtrosCargos,
    montoTotalLinea,

    isGravado,
    isExento,
  };
}

export function sum<T>(arr: T[], f: (x: T) => number) {
  return round5(arr.reduce((acc, it) => acc + (f(it) || 0), 0));
}

export function buildResumenFromLines(lines: Array<Partial<LineCalc>>) {
  const TotalVenta          = sum(lines, l => toNum(l.lineaSubtotal, 0));
  const TotalDescuentos     = sum(lines, l => toNum(l.montoDescuento, 0));
  const TotalVentaNeta      = round5(TotalVenta - TotalDescuentos);

  const TotalImpuesto       = sum(lines, l => toNum(l.montoImpuesto, 0));
  const TotalIVADevuelto    = sum(lines, l => toNum(l.montoIvaDevuelto, 0));
  const TotalOtrosCargos    = sum(lines, l => toNum(l.montoOtrosCargos, 0));

  const TotalGravado        = sum(lines, l => (l?.isGravado ? toNum(l.subtotalConDescuento, 0) : 0));
  const TotalExento         = sum(lines, l => (l?.isExento  ? toNum(l.subtotalConDescuento, 0) : 0));

  const TotalComprobante    = round5(
    TotalVentaNeta + TotalImpuesto + TotalOtrosCargos - TotalIVADevuelto
  );

  return {
    TotalVenta,
    TotalDescuentos,
    TotalVentaNeta,
    TotalImpuesto,
    TotalIVADevuelto,
    TotalOtrosCargos,
    TotalGravado,
    TotalExento,
    TotalComprobante,
  };
}
