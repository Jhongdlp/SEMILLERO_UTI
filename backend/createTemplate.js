const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, HeadingLevel, AlignmentType } = require("docx");
const fs = require("fs");
const path = require("path");

const createTemplate = async () => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: "Plan de Negocio - Semillero UTI", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 400 } }),

          // 1. General Info
          new Paragraph({ text: "1. Información General", heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "Emprendedor: ", bold: true }), new TextRun("{nombre_emprendedor}")] }),
          new Paragraph({ children: [new TextRun({ text: "Proyecto: ", bold: true }), new TextRun("{titulo_proyecto}")] }),

          // 7. Estructura de Costos
          new Paragraph({ text: "7. Estructura de Costos", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),

          // 7.1 Datos Generales
          new Paragraph({ text: "7.1 Datos Generales", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: "Tasa Crecimiento Producción: {tasa_crecimiento_prod}%" }),
          new Paragraph({ text: "Tasa Crecimiento Precio: {tasa_crecimiento_precio}%" }),
          new Paragraph({ text: "Tasa Inflación: {tasa_inflacion}%" }),

          // 7.2 Demanda
          new Paragraph({ text: "7.2 Detalle de Demanda", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Producto", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Cantidad Mensual", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Precio Venta", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Total Mensual", bold: true })] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("{#demanda}{descripcion}")] }),
                  new TableCell({ children: [new Paragraph("{cantidad}")] }),
                  new TableCell({ children: [new Paragraph("{precio_u}")] }),
                  new TableCell({ children: [new Paragraph("{costo_total}{/demanda}")] }),
                ]
              }),
            ],
          }),

          // 7.3 Equipos
          new Paragraph({ text: "7.3 Detalle de Equipos", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Descripción", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Cantidad", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Precio U.", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Total", bold: true })] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("{#equipos}{descripcion}")] }),
                  new TableCell({ children: [new Paragraph("{cantidad}")] }),
                  new TableCell({ children: [new Paragraph("{precio_u}")] }),
                  new TableCell({ children: [new Paragraph("{costo_total}{/equipos}")] }),
                ]
              }),
            ],
          }),

          // 7.5 Inversión Inicial y Financiamiento
          new Paragraph({ text: "7.5 Estructura de Financiamiento", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Rubro / Descripción", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Inversión ($)", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Propia", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Donación", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Préstamo", bold: true })] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("{#inversiones}{descripcion}")] }),
                  new TableCell({ children: [new Paragraph("{valor}")] }),
                  new TableCell({ children: [new Paragraph("{val_propia}")] }),
                  new TableCell({ children: [new Paragraph("{val_donacion}")] }),
                  new TableCell({ children: [new Paragraph("{val_prestamo}{/inversiones}")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "{total_inversion}", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "{total_propia}", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "{total_donacion}", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "{total_prestamo}", bold: true })] }),
                ]
              }),
            ],
          }),

          // 7.6 Proyecciones (Detailed Cash Flow)
          new Paragraph({ text: "7.6 Proyección de Ingresos (Flujo de Caja)", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Descripción", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Año 0", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Año 1", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Año 2", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Año 3", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Año 4", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Año 5", bold: true })] }),
                ]
              }),
              // Rows
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Entradas")] }),
                  new TableCell({ children: [new Paragraph("{ent_0}")] }), new TableCell({ children: [new Paragraph("{ent_1}")] }), new TableCell({ children: [new Paragraph("{ent_2}")] }), new TableCell({ children: [new Paragraph("{ent_3}")] }), new TableCell({ children: [new Paragraph("{ent_4}")] }), new TableCell({ children: [new Paragraph("{ent_5}")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Salidas")] }),
                  new TableCell({ children: [new Paragraph("{sal_0}")] }), new TableCell({ children: [new Paragraph("{sal_1}")] }), new TableCell({ children: [new Paragraph("{sal_2}")] }), new TableCell({ children: [new Paragraph("{sal_3}")] }), new TableCell({ children: [new Paragraph("{sal_4}")] }), new TableCell({ children: [new Paragraph("{sal_5}")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Utilidad Bruta")] }),
                  new TableCell({ children: [new Paragraph("-")] }), new TableCell({ children: [new Paragraph("{util_1}")] }), new TableCell({ children: [new Paragraph("{util_2}")] }), new TableCell({ children: [new Paragraph("{util_3}")] }), new TableCell({ children: [new Paragraph("{util_4}")] }), new TableCell({ children: [new Paragraph("{util_5}")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("15% Trabajadores")] }),
                  new TableCell({ children: [new Paragraph("-")] }), new TableCell({ children: [new Paragraph("{trab_1}")] }), new TableCell({ children: [new Paragraph("{trab_2}")] }), new TableCell({ children: [new Paragraph("{trab_3}")] }), new TableCell({ children: [new Paragraph("{trab_4}")] }), new TableCell({ children: [new Paragraph("{trab_5}")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("25% Imp. Renta")] }),
                  new TableCell({ children: [new Paragraph("-")] }), new TableCell({ children: [new Paragraph("{imp_1}")] }), new TableCell({ children: [new Paragraph("{imp_2}")] }), new TableCell({ children: [new Paragraph("{imp_3}")] }), new TableCell({ children: [new Paragraph("{imp_4}")] }), new TableCell({ children: [new Paragraph("{imp_5}")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Flujo Neto", bold: true })] }),
                  new TableCell({ children: [new Paragraph("{neto_0}")] }), new TableCell({ children: [new Paragraph("{neto_1}")] }), new TableCell({ children: [new Paragraph("{neto_2}")] }), new TableCell({ children: [new Paragraph("{neto_3}")] }), new TableCell({ children: [new Paragraph("{neto_4}")] }), new TableCell({ children: [new Paragraph("{neto_5}")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Acumulado", bold: true })] }),
                  new TableCell({ children: [new Paragraph("{acum_0}")] }), new TableCell({ children: [new Paragraph("{acum_1}")] }), new TableCell({ children: [new Paragraph("{acum_2}")] }), new TableCell({ children: [new Paragraph("{acum_3}")] }), new TableCell({ children: [new Paragraph("{acum_4}")] }), new TableCell({ children: [new Paragraph("{acum_5}")] }),
                ]
              }),
            ],
          }),

          // 7.8 Indicadores
          new Paragraph({ text: "7.8 Indicadores Financieros", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
          new Paragraph({ children: [new TextRun({ text: "VAN: $", bold: true }), new TextRun("{van}")] }),
          new Paragraph({ children: [new TextRun({ text: "TIR: ", bold: true }), new TextRun("{tir}%")] }),
          new Paragraph({ children: [new TextRun({ text: "Periodo Recuperación: ", bold: true }), new TextRun("{payback}")] }),
        ],
      },
    ],
  });

  const templatesDir = path.join(__dirname, "templates");
  if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(templatesDir, "template.docx"), buffer);
  console.log("Template generated successfully.");
};

createTemplate();
