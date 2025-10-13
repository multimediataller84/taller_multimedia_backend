import Customer from "../../CustomerAccount/domain/models/CustomerModel.js";
import type { TInvoiceEndpoint } from "../../Invoice/domain/types/TInvoiceEndpoint.js";
import Tax from "../../Tax/domain/models/TaxModel.js";
import type {
  TEmitter,
  TLineDetails,
  TReceiver,
} from "../domain/types/TElectroniceInvoice.js";
import type { TProductDetails } from "../domain/types/TProductDetails.js";
import { generateConsecutive } from "../utils/generateConsecutive.js";
import { paymentTypeMap } from "../utils/codePaymentMethodConverter.js";
import { paymentMethodLangMap } from "../utils/paymentMethodLangConverter.js";
import moment from "moment-timezone";
import type { TElectronicInvoiceJSON } from "../domain/types/TElectronicInvoiceJSON.js";

moment.locale("es");

export class ConvertJSON {
  private readonly CURRENCY: string = "CRC";
  private readonly ACTIVITY_CODE: string = "620100";
  constructor(
    private readonly invoice: TInvoiceEndpoint,
    private readonly products: TProductDetails[]
  ) {}

  async transformJSON(): Promise<TElectronicInvoiceJSON> {
    const [receptor, detalles] = await Promise.all([
      this.getReceptor(),
      this.getDetails(),
    ]);

    return {
      id: this.invoice.id,
      consecutivo: generateConsecutive(1) ?? this.invoice.invoice_number,
      codigoActividad: this.ACTIVITY_CODE,
      emisor: this.getEmisor(),
      receptor,
      condicionVenta: paymentTypeMap.get(this.invoice.payment_method) ?? "NA",
      medioPago: paymentMethodLangMap[this.invoice.payment_method],
      moneda: this.CURRENCY,
      fechaEmision: moment().tz("America/Costa_Rica").format("LLLL"),
      subtotal: parseFloat(String(this.invoice.subtotal)),
      impuestoTotal: parseFloat(String(this.invoice.tax_total)),
      total: parseFloat(String(this.invoice.total)),
      detalles,
    };
  }

  private getEmisor(): TEmitter {
    return {
      nombre: "TRAMO LA MARAVILLA",
      nombreComercial: "Tramo La Maravilla S.A.",
      tipoIdentificacion: "02",
      identificacion: "3-101-123456",
      provincia: "2",
      canton: "01",
      distrito: "01",
      direccion: "Alajuela, Costa Rica",
      telefono: "8888-9999",
      email: "facturacion@empresademo.com",
    };
  }

  private async getReceptor(): Promise<TReceiver> {
    const customer = await Customer.findByPk(this.invoice.customer_id);
    if (customer) {
      return {
        nombre: `${customer.name} ${customer.last_name}`.trim(),
        tipoIdentificacion: "01",
        identificacion: String(customer.id_number),
        telefono: String(customer.phone),
        email: customer.email,
        provincia: "NA",
        canton: "NA",
        distrito: "NA",
        direccion: customer.address,
      };
    }

    return {
      nombre: "NA",
      tipoIdentificacion: "NA",
      identificacion: "NA",
      telefono: "NA",
      email: "NA",
      provincia: "NA",
      canton: "NA",
      distrito: "NA",
      direccion: "NA",
    };
  }

  private async getDetails(): Promise<TLineDetails[]> {
    return await Promise.all(
      this.products.map(async (item: TProductDetails, index: number) => {
        const tarifa = await this.getTax(item.product.tax_id);
        return {
          codigoComercial: {
            tipo: "01",
            codigo: item.product.sku || `PROD${index + 1}`,
          },
          descripcion: item.product.product_name || "Producto sin descripción",
          cantidad: item.quantity || 1,
          unidadMedida: "NA",
          precioUnitario: parseFloat(String(item.unit_price)),
          impuesto: {
            codigo: "01",
            codigoTarifa: "08",
            tarifa,
          },
        };
      })
    );
  }

  private async getTax(id: number): Promise<number> {
    const tax = await Tax.findByPk(id);
    return tax?.percentage ?? 0;
  }
}
