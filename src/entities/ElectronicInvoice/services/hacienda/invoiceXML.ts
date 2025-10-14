import { generateConsecutive } from "../../utils/generateConsecutive.js";
import type { TElectroniceInvoice } from "../../domain/types/TElectroniceInvoice.js";

export class ElectroniceInvoiceXML {
  private readonly COUNTRYCODE: string = "506";
  private invoice: TElectroniceInvoice;

  constructor(invoice: any) {
    this.invoice = invoice;
  }

   private generarClave(): string {
    const fecha = new Date();
    const day = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const year = String(fecha.getFullYear()).slice(-2);
    
    const id_number = this.invoice.emisor.identificacion.padStart(12, '0');
    const consecutivo = generateConsecutive(1);
    const situation = '1';
    const securityCode = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
    
    return this.COUNTRYCODE + day + mes + year + id_number + consecutivo + situation + securityCode;
  }

  private generarDetalles(): string {
    return this.invoice.detalles.map((detalle, idx) => {
      const lineaSubtotal = detalle.cantidad * detalle.precioUnitario;
      const montoDescuento = detalle.descuento || 0;
      const subtotalConDescuento = lineaSubtotal - montoDescuento;
      const montoImpuesto = detalle.impuesto 
        ? subtotalConDescuento * (detalle.impuesto.tarifa / 100)
        : 0;
      
      const ivaDevuelto = detalle.ivaDevuelto || 0;
      const otrosCargos = detalle.otrosCargos || 0;
      
      const total = subtotalConDescuento + montoImpuesto + otrosCargos - ivaDevuelto;
      
      return `
    <LineaDetalle>
      <NumeroLinea>${idx + 1}</NumeroLinea>
      ${detalle.codigoComercial ? `<CodigoComercial>
        <Tipo>${detalle.codigoComercial.tipo}</Tipo>
        <Codigo>${detalle.codigoComercial.codigo}</Codigo>
      </CodigoComercial>` : ''}
      <Cantidad>${detalle.cantidad}</Cantidad>
      <UnidadMedida>${detalle.unidadMedida || 'Sp'}</UnidadMedida>
      <Detalle>${this.escaparXML(detalle.descripcion)}</Detalle>
      <PrecioUnitario>${detalle.precioUnitario.toFixed(5)}</PrecioUnitario>
      <MontoTotal>${lineaSubtotal.toFixed(5)}</MontoTotal>
      ${montoDescuento > 0 ? `<Descuento>
        <MontoDescuento>${montoDescuento.toFixed(5)}</MontoDescuento>
        <NaturalezaDescuento>${this.escaparXML(detalle.naturalezaDescuento || 'Descuento')}</NaturalezaDescuento>
      </Descuento>` : ''}
      <SubTotal>${subtotalConDescuento.toFixed(5)}</SubTotal>
      ${detalle.impuesto ? `<Impuesto>
        <Codigo>${detalle.impuesto.codigo}</Codigo>
        <CodigoTarifa>${detalle.impuesto.codigoTarifa}</CodigoTarifa>
        <Tarifa>${detalle.impuesto.tarifa.toFixed(2)}</Tarifa>
        <Monto>${montoImpuesto.toFixed(5)}</Monto>
        ${detalle.impuesto.exoneracion ? `<Exoneracion>
          <TipoDocumento>${detalle.impuesto.exoneracion.tipoDocumento}</TipoDocumento>
          <NumeroDocumento>${detalle.impuesto.exoneracion.numeroDocumento}</NumeroDocumento>
          <NombreInstitucion>${this.escaparXML(detalle.impuesto.exoneracion.nombreInstitucion)}</NombreInstitucion>
          <FechaEmision>${detalle.impuesto.exoneracion.fechaEmision}</FechaEmision>
          <PorcentajeExoneracion>${detalle.impuesto.exoneracion.porcentaje}</PorcentajeExoneracion>
          <MontoExoneracion>${detalle.impuesto.exoneracion.monto.toFixed(5)}</MontoExoneracion>
        </Exoneracion>` : ''}
      </Impuesto>` : ''}
      ${ivaDevuelto > 0 ? `<ImpuestoNeto>${(montoImpuesto - ivaDevuelto).toFixed(5)}</ImpuestoNeto>` : ''}
      <MontoTotalLinea>${total.toFixed(5)}</MontoTotalLinea>
    </LineaDetalle>`;
    }).join('');
  }

  private escaparXML(texto: string): string {
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  generarXML(): { xml: string; clave: string } {
    const clave = this.generarClave();
    const fecha = new Date().toISOString();
    
    let subtotal = 0;
    let totalImpuestos = 0;
    let totalIVADevuelto = 0;
    let totalOtrosCargos = 0;
    
    this.invoice.detalles.forEach(detalle => {
      const lineaSubtotal = detalle.cantidad * detalle.precioUnitario;
      const montoDescuento = detalle.descuento || 0;
      const subtotalConDescuento = lineaSubtotal - montoDescuento;
      subtotal += subtotalConDescuento;
      
      if (detalle.impuesto) {
        const montoImpuesto = subtotalConDescuento * (detalle.impuesto.tarifa / 100);
        totalImpuestos += montoImpuesto;
      }
      
      if (detalle.ivaDevuelto) {
        totalIVADevuelto += detalle.ivaDevuelto;
      }
      
      if (detalle.otrosCargos) {
        totalOtrosCargos += detalle.otrosCargos;
      }
    });
    
    const total = subtotal + totalImpuestos + totalOtrosCargos - totalIVADevuelto;
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<FacturaElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.4/facturaElectronica" 
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                     xsi:schemaLocation="https://www.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2016/v4.4/FacturaElectronica_V4.4.xsd">
  <Clave>${clave}</Clave>
  <CodigoActividad>${this.invoice.codigoActividad}</CodigoActividad>
  <NumeroConsecutivo>${this.invoice.consecutivo}</NumeroConsecutivo>
  <FechaEmision>${fecha}</FechaEmision>
  <Emisor>
    <Nombre>${this.escaparXML(this.invoice.emisor.nombre)}</Nombre>
    <Identificacion>
      <Tipo>${this.invoice.emisor.tipoIdentificacion}</Tipo>
      <Numero>${this.invoice.emisor.identificacion}</Numero>
    </Identificacion>
    <NombreComercial>${this.escaparXML(this.invoice.emisor.nombreComercial || this.invoice.emisor.nombre)}</NombreComercial>
    <Ubicacion>
      <Provincia>${this.invoice.emisor.provincia}</Provincia>
      <Canton>${this.invoice.emisor.canton}</Canton>
      <Distrito>${this.invoice.emisor.distrito}</Distrito>
      <OtrasSenas>${this.escaparXML(this.invoice.emisor.direccion)}</OtrasSenas>
    </Ubicacion>
    <Telefono>
      <CodigoPais>506</CodigoPais>
      <NumTelefono>${this.invoice.emisor.telefono}</NumTelefono>
    </Telefono>
    <CorreoElectronico>${this.invoice.emisor.email}</CorreoElectronico>
  </Emisor>
  <Receptor>
    <Nombre>${this.escaparXML(this.invoice.receptor.nombre)}</Nombre>
    <Identificacion>
      <Tipo>${this.invoice.receptor.tipoIdentificacion}</Tipo>
      <Numero>${this.invoice.receptor.identificacion}</Numero>
    </Identificacion>
    ${this.invoice.receptor.telefono ? `<Telefono>
      <CodigoPais>506</CodigoPais>
      <NumTelefono>${this.invoice.receptor.telefono}</NumTelefono>
    </Telefono>` : ''}
    <CorreoElectronico>${this.invoice.receptor.email}</CorreoElectronico>
  </Receptor>
  <CondicionVenta>${this.invoice.condicionVenta || '01'}</CondicionVenta>
  <MedioPago>${this.invoice.medioPago || '01'}</MedioPago>
  <DetalleServicio>
    ${this.generarDetalles()}
  </DetalleServicio>
  ${totalOtrosCargos > 0 ? `<OtrosCargos>
    <TipoDocumento>01</TipoDocumento>
    <Detalle>Otros cargos aplicables</Detalle>
    <MontoCargo>${totalOtrosCargos.toFixed(5)}</MontoCargo>
  </OtrosCargos>` : ''}
  <ResumenFactura>
    <CodigoTipoMoneda>
      <CodigoMoneda>${this.invoice.moneda || 'CRC'}</CodigoMoneda>
      <TipoCambio>1.00000</TipoCambio>
    </CodigoTipoMoneda>
    <TotalServGravados>${subtotal.toFixed(5)}</TotalServGravados>
    <TotalServExentos>0.00000</TotalServExentos>
    <TotalServExonerado>0.00000</TotalServExonerado>
    <TotalMercanciasGravadas>0.00000</TotalMercanciasGravadas>
    <TotalMercanciasExentas>0.00000</TotalMercanciasExentas>
    <TotalMercExonerada>0.00000</TotalMercExonerada>
    <TotalGravado>${subtotal.toFixed(5)}</TotalGravado>
    <TotalExento>0.00000</TotalExento>
    <TotalExonerado>0.00000</TotalExonerado>
    <TotalVenta>${subtotal.toFixed(5)}</TotalVenta>
    <TotalDescuentos>0.00000</TotalDescuentos>
    <TotalVentaNeta>${subtotal.toFixed(5)}</TotalVentaNeta>
    <TotalImpuesto>${totalImpuestos.toFixed(5)}</TotalImpuesto>
    ${totalIVADevuelto > 0 ? `<TotalIVADevuelto>${totalIVADevuelto.toFixed(5)}</TotalIVADevuelto>` : ''}
    ${totalOtrosCargos > 0 ? `<TotalOtrosCargos>${totalOtrosCargos.toFixed(5)}</TotalOtrosCargos>` : ''}
    <TotalComprobante>${total.toFixed(5)}</TotalComprobante>
  </ResumenFactura>
</FacturaElectronica>`;
    
    return { xml, clave };
  }
}