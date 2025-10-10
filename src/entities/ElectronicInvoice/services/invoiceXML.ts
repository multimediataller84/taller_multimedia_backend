import { generateConsecutive } from "../utils/generateConsecutive.js";
import type { TElectroniceInvoice } from "../domain/types/TElectroniceInvoice.js";
import { calcLine } from "../utils/taxCalc.js";

export class ElectroniceInvoiceXML {
  private readonly COUNTRYCODE: string = "506";
  private invoice: TElectroniceInvoice;

  constructor(invoice: any) {
    this.invoice = invoice;
  }

  private pad2(n: number) { return String(n).padStart(2, "0"); }
  private fmt5(n: number) { return Number(n ?? 0).toFixed(5); }
  private fmt2(n: number) { return Number(n ?? 0).toFixed(2); }

  private generarClave(): string {
    const fecha = new Date();
    const day = this.pad2(fecha.getDate());
    const mes = this.pad2(fecha.getMonth() + 1);
    const year = String(fecha.getFullYear()).slice(-2);

    const id_number = String(this.invoice.emisor.identificacion ?? "").padStart(12, "0");
    const consecutivo = generateConsecutive(1);
    const situation = "1";
    const securityCode = String(Math.floor(Math.random() * 100000000)).padStart(8, "0");

    return this.COUNTRYCODE + day + mes + year + id_number + consecutivo + situation + securityCode;
  }

  private escaparXML(texto: string = ""): string {
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  private buildLineaXML(detalle: any, idx: number, r: any): string {
    const hasTax = !!detalle?.impuesto && Number(detalle?.impuesto?.tarifa) > 0;

    return `
    <LineaDetalle>
      <NumeroLinea>${idx + 1}</NumeroLinea>
      ${
        detalle?.codigoComercial
          ? `<CodigoComercial>
        <Tipo>${this.escaparXML(detalle.codigoComercial.tipo)}</Tipo>
        <Codigo>${this.escaparXML(detalle.codigoComercial.codigo)}</Codigo>
      </CodigoComercial>`
          : ""
      }
      <Cantidad>${detalle.cantidad}</Cantidad>
      <UnidadMedida>${this.escaparXML(detalle.unidadMedida || "Sp")}</UnidadMedida>
      <Detalle>${this.escaparXML(detalle.descripcion)}</Detalle>
      <PrecioUnitario>${this.fmt5(detalle.precioUnitario)}</PrecioUnitario>
      <MontoTotal>${this.fmt5(r.lineaSubtotal)}</MontoTotal>
      ${
        r.montoDescuento > 0
          ? `<Descuento>
        <MontoDescuento>${this.fmt5(r.montoDescuento)}</MontoDescuento>
        <NaturalezaDescuento>${this.escaparXML(detalle.naturalezaDescuento || "Descuento")}</NaturalezaDescuento>
      </Descuento>`
          : ""
      }
      <SubTotal>${this.fmt5(r.subtotalConDescuento)}</SubTotal>
      ${
        hasTax
          ? `<Impuesto>
        <Codigo>${this.escaparXML(detalle.impuesto.codigo)}</Codigo>
        <CodigoTarifa>${this.escaparXML(detalle.impuesto.codigoTarifa)}</CodigoTarifa>
        <Tarifa>${this.fmt2(detalle.impuesto.tarifa)}</Tarifa>
        <Monto>${this.fmt5(r.montoImpuesto)}</Monto>
        ${
          detalle.impuesto.exoneracion
            ? `<Exoneracion>
          <TipoDocumento>${this.escaparXML(detalle.impuesto.exoneracion.tipoDocumento)}</TipoDocumento>
          <NumeroDocumento>${this.escaparXML(detalle.impuesto.exoneracion.numeroDocumento)}</NumeroDocumento>
          <NombreInstitucion>${this.escaparXML(detalle.impuesto.exoneracion.nombreInstitucion)}</NombreInstitucion>
          <FechaEmision>${this.escaparXML(detalle.impuesto.exoneracion.fechaEmision)}</FechaEmision>
          <PorcentajeExoneracion>${this.escaparXML(detalle.impuesto.exoneracion.porcentaje)}</PorcentajeExoneracion>
          <MontoExoneracion>${this.fmt5(detalle.impuesto.exoneracion.monto)}</MontoExoneracion>
        </Exoneracion>`
            : ""
        }
      </Impuesto>`
          : ""
      }
      ${r.montoIvaDevuelto > 0 ? `<ImpuestoNeto>${this.fmt5(r.montoImpuesto - r.montoIvaDevuelto)}</ImpuestoNeto>` : ""}
      <MontoTotalLinea>${this.fmt5(r.montoTotalLinea)}</MontoTotalLinea>
    </LineaDetalle>`;
  }

  private generarDetallesYTotales() {
    let TotalVenta = 0;  
    let TotalDescuentos = 0;
    let TotalVentaNeta = 0;  
    let TotalImpuesto = 0; 
    let TotalIVADevuelto = 0;  
    let TotalOtrosCargos = 0; 
    let TotalGravado = 0; 
    let TotalExento = 0;
    let TotalComprobante = 0;

    const lineasXML: string[] = [];

    (this.invoice.detalles ?? []).forEach((detalle: any, idx: number) => {
      const r = calcLine(detalle);
      TotalVenta += r.lineaSubtotal;
      TotalDescuentos += r.montoDescuento;
      TotalVentaNeta += r.subtotalConDescuento;
      TotalImpuesto += r.montoImpuesto;
      TotalIVADevuelto += r.montoIvaDevuelto;
      TotalOtrosCargos += r.montoOtrosCargos;

      if (r.isGravado) TotalGravado += r.subtotalConDescuento;
      if (r.isExento) TotalExento += r.subtotalConDescuento;

      TotalComprobante += r.montoTotalLinea;

      lineasXML.push(this.buildLineaXML(detalle, idx, r));
    });

    return {
      lineasXML: lineasXML.join(""),
      totales: {
        TotalVenta,
        TotalDescuentos,
        TotalVentaNeta,
        TotalImpuesto,
        TotalIVADevuelto,
        TotalOtrosCargos,
        TotalGravado,
        TotalExento,
        TotalComprobante,
      },
    };
  }

  generarXML(): { xml: string; clave: string } {
    const clave = this.generarClave();
    const fecha = new Date().toISOString();

    const { lineasXML, totales } = this.generarDetallesYTotales();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<FacturaElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.4/facturaElectronica" 
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                     xsi:schemaLocation="https://www.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2016/v4.4/FacturaElectronica_V4.4.xsd">
  <Clave>${clave}</Clave>
  <CodigoActividad>${this.escaparXML(this.invoice.codigoActividad)}</CodigoActividad>
  <NumeroConsecutivo>${this.escaparXML(this.invoice.consecutivo)}</NumeroConsecutivo>
  <FechaEmision>${fecha}</FechaEmision>

  <Emisor>
    <Nombre>${this.escaparXML(this.invoice.emisor.nombre)}</Nombre>
    <Identificacion>
      <Tipo>${this.escaparXML(this.invoice.emisor.tipoIdentificacion)}</Tipo>
      <Numero>${this.escaparXML(this.invoice.emisor.identificacion)}</Numero>
    </Identificacion>
    <NombreComercial>${this.escaparXML(this.invoice.emisor.nombreComercial || this.invoice.emisor.nombre)}</NombreComercial>
    <Ubicacion>
      <Provincia>${this.escaparXML(this.invoice.emisor.provincia)}</Provincia>
      <Canton>${this.escaparXML(this.invoice.emisor.canton)}</Canton>
      <Distrito>${this.escaparXML(this.invoice.emisor.distrito)}</Distrito>
      <OtrasSenas>${this.escaparXML(this.invoice.emisor.direccion)}</OtrasSenas>
    </Ubicacion>
    <Telefono>
      <CodigoPais>506</CodigoPais>
      <NumTelefono>${this.escaparXML(this.invoice.emisor.telefono)}</NumTelefono>
    </Telefono>
    <CorreoElectronico>${this.escaparXML(this.invoice.emisor.email)}</CorreoElectronico>
  </Emisor>

  <Receptor>
    <Nombre>${this.escaparXML(this.invoice.receptor.nombre)}</Nombre>
    <Identificacion>
      <Tipo>${this.escaparXML(this.invoice.receptor.tipoIdentificacion)}</Tipo>
      <Numero>${this.escaparXML(this.invoice.receptor.identificacion)}</Numero>
    </Identificacion>
    ${
      this.invoice.receptor.telefono
        ? `<Telefono>
      <CodigoPais>506</CodigoPais>
      <NumTelefono>${this.escaparXML(this.invoice.receptor.telefono)}</NumTelefono>
    </Telefono>`
        : ""
    }
    <CorreoElectronico>${this.escaparXML(this.invoice.receptor.email)}</CorreoElectronico>
  </Receptor>

  <CondicionVenta>${this.escaparXML(this.invoice.condicionVenta || "01")}</CondicionVenta>
  <MedioPago>${this.escaparXML(this.invoice.medioPago || "01")}</MedioPago>

  <DetalleServicio>
    ${lineasXML}
  </DetalleServicio>

  ${
    totales.TotalOtrosCargos > 0
      ? `<OtrosCargos>
    <TipoDocumento>01</TipoDocumento>
    <Detalle>Otros cargos aplicables</Detalle>
    <MontoCargo>${this.fmt5(totales.TotalOtrosCargos)}</MontoCargo>
  </OtrosCargos>`
      : ""
  }

  <ResumenFactura>
    <CodigoTipoMoneda>
      <CodigoMoneda>${this.escaparXML(this.invoice.moneda || "CRC")}</CodigoMoneda>
      <TipoCambio>1.00000</TipoCambio>
    </CodigoTipoMoneda>

    <TotalServGravados>${this.fmt5(totales.TotalGravado)}</TotalServGravados>
    <TotalServExentos>${this.fmt5(totales.TotalExento)}</TotalServExentos>
    <TotalServExonerado>0.00000</TotalServExonerado>

    <TotalMercanciasGravadas>0.00000</TotalMercanciasGravadas>
    <TotalMercanciasExentas>0.00000</TotalMercanciasExentas>
    <TotalMercExonerada>0.00000</TotalMercExonerada>

    <TotalGravado>${this.fmt5(totales.TotalGravado)}</TotalGravado>
    <TotalExento>${this.fmt5(totales.TotalExento)}</TotalExento>
    <TotalExonerado>0.00000</TotalExonerado>

    <TotalVenta>${this.fmt5(totales.TotalVenta)}</TotalVenta>
    <TotalDescuentos>${this.fmt5(totales.TotalDescuentos)}</TotalDescuentos>
    <TotalVentaNeta>${this.fmt5(totales.TotalVentaNeta)}</TotalVentaNeta>

    <TotalImpuesto>${this.fmt5(totales.TotalImpuesto)}</TotalImpuesto>
    ${totales.TotalIVADevuelto > 0 ? `<TotalIVADevuelto>${this.fmt5(totales.TotalIVADevuelto)}</TotalIVADevuelto>` : ""}
    ${totales.TotalOtrosCargos > 0 ? `<TotalOtrosCargos>${this.fmt5(totales.TotalOtrosCargos)}</TotalOtrosCargos>` : ""}

    <TotalComprobante>${this.fmt5(totales.TotalComprobante)}</TotalComprobante>
  </ResumenFactura>
</FacturaElectronica>`;

    return { xml, clave };
  }
}
