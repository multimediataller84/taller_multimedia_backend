import Customer from "../../../CustomerAccount/domain/models/CustomerModel.js";
import type { TInvoiceEndpoint } from "../../../Invoice/domain/types/TInvoiceEndpoint.js";
import Tax from "../../../Tax/domain/models/TaxModel.js";
import type {
  TEmitter,
  TLineDetails,
  TReceiver,
} from "../../domain/types/TElectroniceInvoice.js";
import type { TProductDetails } from "../../domain/types/TProductDetails.js";
import { paymentTypeMap } from "../../utils/codePaymentMethodConverter.js";
import { paymentMethodLangMap } from "../../utils/paymentMethodLangConverter.js";
import moment from "moment-timezone";
import type { TElectronicInvoiceJSON } from "../../domain/types/TElectronicInvoiceJSON.js";
import type { TTaxEndpoint } from "../../../Tax/domain/types/TTaxEndpoint.js";
import { idNumberMap } from "../../utils/codeIDNumberConverter.js";
import type { IConsecutiveResult } from "../../domain/interfaces/IConsecutiveResult.js";
import UnitMeasure from "../../../Product/domain/models/UnitMeasure.js";
import type { TUnitMeasure } from "../../../Product/domain/types/TUnitMeasure.js";

moment.locale("es");

export class ConvertJSON {
  private readonly CURRENCY: string = "CRC";
  private readonly ACTIVITY_CODE: string = "620100";
  constructor(
    private readonly invoice: TInvoiceEndpoint,
    private readonly products: TProductDetails[],
    private readonly consecutive: IConsecutiveResult,
  ) {}

  async transformJSON(): Promise<TElectronicInvoiceJSON> {
    const [receptor, detalles] = await Promise.all([
      this.getReceptor(),
      this.getDetails(),
    ]);

    return {
      id: this.invoice.id,
      consecutivo: this.consecutive.consecutive,
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
      nombreComercial: "VERDULERIA Y CARNICERIA LA MARAVILLA SOCIEDAD ANONIMA",
      tipoIdentificacion: "02",
      identificacion: "3-101-402977",
      provincia: "6",
      canton: "601",
      distrito: "60101",
      direccion: "Puntarenas, Costa Rica",
      telefono: "8888-9999",
      email: "maravilla@facsa.cr",
    };
  }

  private async getReceptor(): Promise<TReceiver> {
    const customer = await Customer.findByPk(this.invoice.customer_id);
    if (customer) {
      return {
        nombre: `${customer.name} ${customer.last_name}`.trim(),
        tipoIdentificacion:
          idNumberMap.get(customer.identification_type) ?? "01",
        identificacion: String(customer.id_number),
        telefono: String(customer.phone),
        email: customer.email,
        provincia_id: customer.province_id ?? 6,
        canton_id: customer.canton_id ?? 601,
        distrito_id: customer.district_id ?? 60101,
        direccion: customer.address,
      };
    }

    return {
      nombre: "NA",
      tipoIdentificacion: "NA",
      identificacion: "NA",
      telefono: "NA",
      email: "NA",
      provincia_id: 6,
      canton_id: 601,
      distrito_id: 60101,
      direccion: "NA",
    };
  }

  private async getDetails(): Promise<TLineDetails[]> {
    return await Promise.all(
      this.products.map(async (item: TProductDetails) => {
        const tax = await this.getTax(item.product.tax_id);
        const unitMeasure = await this.getUnitMeasure(item.product.unit_measure_id)
        return {
          codigoComercial: {
            tipo: "01",
            codigo: item.product.sku,
          },
          descripcion: item.product.product_name,
          cantidad: item.quantity,
          unidadMedida: unitMeasure?.symbol ?? "NA",
          precioUnitario: parseFloat(
            String(
              Number(item.product.unit_price) +
                Number(item.product.profit_margin)
            )
          ),
          impuesto: {
            codigo: "01",
            codigoTarifa: "08",
            tarifa: tax?.percentage ?? 0,
            codigoCABYS: tax?.name ?? "NA",
          },
        };
      })
    );
  }

  private async getTax(id: number): Promise<TTaxEndpoint | null> {
    const tax = await Tax.findByPk(id);
    return tax;
  }

  private async getUnitMeasure(id: number): Promise<TUnitMeasure | null> {
    const unitMeasure = await UnitMeasure.findByPk(id);
    return unitMeasure;
  }
}