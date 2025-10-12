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
        codigo: "PROD1",
      },
      descripcion: "Arroz blanco 1 kg",
      cantidad: 2,
      unidadMedida: "Unid",
      precioUnitario: 950,
      impuesto: {
        codigo: "01",
        codigoTarifa: "08",
        tarifa: 13,
      },
    },
    {
      codigoComercial: {
        tipo: "01",
        codigo: "PROD2",
      },
      descripcion: "Frijoles negros 1 kg",
      cantidad: 1,
      unidadMedida: "Unid",
      precioUnitario: 1200,
      impuesto: {
        codigo: "01",
        codigoTarifa: "08",
        tarifa: 13,
      },
    },
    {
      codigoComercial: {
        tipo: "01",
        codigo: "PROD3",
      },
      descripcion: "Aceite vegetal 900 ml",
      cantidad: 1,
      unidadMedida: "Unid",
      precioUnitario: 1850,
      impuesto: {
        codigo: "01",
        codigoTarifa: "08",
        tarifa: 13,
      },
    },
    {
      codigoComercial: {
        tipo: "01",
        codigo: "PROD4",
      },
      descripcion: "Azúcar cruda 2 kg",
      cantidad: 1,
      unidadMedida: "Unid",
      precioUnitario: 1600,
      impuesto: {
        codigo: "01",
        codigoTarifa: "08",
        tarifa: 13,
      },
    },
    {
      codigoComercial: {
        tipo: "01",
        codigo: "PROD5",
      },
      descripcion: "Leche entera 1 L",
      cantidad: 3,
      unidadMedida: "Unid",
      precioUnitario: 850,
      impuesto: {
        codigo: "01",
        codigoTarifa: "08",
        tarifa: 13,
      },
    },
    {
      codigoComercial: {
        tipo: "01",
        codigo: "PROD6",
      },
      descripcion: "Huevos grandes (cartón 12 unidades) grandes (cartón 12 unidades)",
      cantidad: 1,
      unidadMedida: "Unid",
      precioUnitario: 1800,
      impuesto: {
        codigo: "01",
        codigoTarifa: "08",
        tarifa: 0,
      },
    },
    {
      codigoComercial: {
        tipo: "01",
        codigo: "PROD0007",
      },
      descripcion: "Pan blanco 500 g",
      cantidad: 1,
      unidadMedida: "Unid",
      precioUnitario: 1200,
      impuesto: {
        codigo: "01",
        codigoTarifa: "08",
        tarifa: 0,
      },
    },
    {
      codigoComercial: {
        tipo: "01",
        codigo: "PROD80",
      },
      descripcion: "Café molido 500 g",
      cantidad: 1,
      unidadMedida: "Unid",
      precioUnitario: 2850,
      impuesto: {
        codigo: "01",
        codigoTarifa: "08",
        tarifa: 13,
      },
    }
  ],
};
