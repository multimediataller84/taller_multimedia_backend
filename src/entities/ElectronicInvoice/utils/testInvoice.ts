export const jsonTest = {
  consecutivo: "00100001010000000001",
  codigoActividad: "620100",
  emisor: {
    nombre: "Empresa Demo S.A.",
    nombreComercial: "Demo Store",
    tipoIdentificacion: "02",
    identificacion: "3101234567",
    provincia: "4",
    canton: "01",
    distrito: "01",
    direccion: "100 metros norte de la iglesia",
    telefono: "22334455",
    email: "facturacion@empresademo.com",
  },
  receptor: {
    nombre: "Juan Pérez García",
    tipoIdentificacion: "01",
    identificacion: "109876543",
    telefono: "88776655",
    email: "juan.perez@email.com",
  },
  condicionVenta: "01",
  medioPago: "01",
  moneda: "CRC",
  detalles: [
    {
      codigoComercial: {
        tipo: "01",
        codigo: "PROD001",
      },
      descripcion: "Servicio de desarrollo web",
      cantidad: 10,
      unidadMedida: "Sp",
      precioUnitario: 50000,
      impuesto: {
        codigo: "01",
        codigoTarifa: "08",
        tarifa: 13,
      },
    },
  ],
};
