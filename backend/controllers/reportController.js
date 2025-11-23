const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const { Project } = require('../setupDb');

/**
 * Controller to generate the Word report
 * 
 * INSTRUCCIONES PARA LA PLANTILLA WORD (.docx):
 * Para que esto funcione, tu archivo Word debe tener los siguientes "tags":
 * 
 * 1. Datos Simples:
 *    - {nombre_emprendedor}
 *    - {titulo_proyecto}
 *    - {resumen_canvas}
 * 
 * 2. Tablas (Loops):
 *    Para la tabla de Inversiones, usa:
 *    {#inversiones}
 *       Columna Concepto: {concepto}
 *       Columna Valor:    {valor}
 *       Columna Fuente:   {fuente}
 *    {/inversiones}
 * 
 *    Para la tabla de Costos Unitarios, usa:
 *    {#costos}
 *       Columna Item:     {item}
 *       Columna Unidad:   {unidad}
 *       Columna Cantidad: {cantidad}
 *       Columna Precio:   {precio_u}
 *       Columna Total:    {costo_total}
 *    {/costos}
 */
const generateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByPk(id);

        if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

        // Correct path: controllers -> backend -> templates
        const templatePath = path.resolve(__dirname, '../templates/template.docx');

        console.log('Template path:', templatePath);
        console.log('Template exists:', fs.existsSync(templatePath));

        if (!fs.existsSync(templatePath)) {
            return res.status(500).json({ error: 'Plantilla no encontrada.', path: templatePath });
        }

        const content = fs.readFileSync(templatePath, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // Helper to format currency
        const fmt = (n) => parseFloat(n || 0).toFixed(2);

        // Prepare Data
        const data = {
            nombre_emprendedor: project.nombre_emprendedor,
            titulo_proyecto: project.titulo_proyecto,
            resumen_canvas: project.resumen_canvas,

            // 7.1 General
            tasa_crecimiento_prod: project.tasa_crecimiento_prod || '0',
            tasa_crecimiento_precio: project.tasa_crecimiento_precio || '0',
            tasa_inflacion: project.tasa_inflacion || '0',

            // 7.2 Demanda
            demanda: (project.detalle_demanda || []).map(d => ({
                descripcion: d.descripcion,
                cantidad: d.cantidad,
                precio_u: fmt(d.precio_u),
                costo_total: fmt(d.costo_total)
            })),

            // 7.3 Detalle de Equipos
            equipos: (project.detalle_equipos || []).map(e => ({
                descripcion: e.descripcion,
                cantidad: e.cantidad,
                precio_u: fmt(e.precio_u),
                costo_total: fmt(e.costo_total)
            })),

            // 7.5 Inversión Inicial y Financiamiento
            inversiones: (project.inversion_inicial || []).map(i => ({
                descripcion: i.descripcion,
                valor: fmt(i.valor),
                val_propia: i.fuente === 'Propia' ? fmt(i.valor) : '-',
                val_donacion: i.fuente === 'Donación' ? fmt(i.valor) : '-',
                val_prestamo: i.fuente === 'Préstamo' ? fmt(i.valor) : '-'
            })),
            total_inversion: fmt((project.inversion_inicial || []).reduce((sum, i) => sum + (parseFloat(i.valor) || 0), 0)),
            total_propia: fmt((project.estructura_financiamiento?.propia || 0)),
            total_donacion: fmt((project.estructura_financiamiento?.donacion || 0)),
            total_prestamo: fmt((project.estructura_financiamiento?.prestamo || 0)),

            // 7.4 Costos Unitarios (Nested)
            costos_unitarios: (project.costos_unitarios || []).map(prod => ({
                descripcion: prod.descripcion,
                insumos: (prod.insumos || []).map(insumo => ({
                    descripcion: insumo.descripcion,
                    unidad: insumo.unidad,
                    cantidad: insumo.cantidad,
                    precio_u: fmt(insumo.precio_u),
                    costo_total: fmt(insumo.costo_total)
                }))
            })),

            // 7.6 Proyecciones (Detailed Cash Flow - Flattened for Template)
            ...(() => {
                const flows = project.proyeccion_ingresos?.flujo_caja || [];
                const cf = {};
                flows.forEach((f, i) => {
                    // i corresponds to Year (0 to 5) if array is sorted, but let's use f.anio
                    const y = f.anio;
                    cf[`ent_${y}`] = fmt(f.entradas);
                    cf[`sal_${y}`] = fmt(f.salidas);
                    cf[`util_${y}`] = fmt(f.utilidadBruta);
                    cf[`trab_${y}`] = fmt(f.partTrabajadores);
                    cf[`imp_${y}`] = fmt(f.impRenta);
                    cf[`neto_${y}`] = fmt(f.flujoNeto);
                    cf[`acum_${y}`] = fmt(f.acumulado);
                });
                return cf;
            })(),

            // 7.8 Indicadores
            van: fmt(project.indicadores_financieros?.van),
            tir: fmt(project.indicadores_financieros?.tir),
            payback: project.indicadores_financieros?.payback || 'N/A'
        };

        doc.render(data);

        const buf = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
        const filename = `Plan_Negocio_${project.id}.docx`;

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename=${filename}`,
            'Content-Length': buf.length,
        });

        res.send(buf);

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Error al generar el reporte', details: error.message });
    }
};

module.exports = { generateReport };

