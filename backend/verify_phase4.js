const fetch = require('node-fetch');
const fs = require('fs');

const API_URL = 'http://localhost:3001/api';

const sampleProject = {
    nombre_emprendedor: "Maria Lopez",
    titulo_proyecto: "Panaderia Gourmet",
    tasa_crecimiento_prod: "2.4",
    tasa_crecimiento_precio: "2.5",
    tasa_inflacion: "2.75",
    detalle_demanda: [
        { descripcion: "Pan de Masa Madre", cantidad: 500, precio_u: 2.50, costo_total: 1250.00 }
    ],
    detalle_equipos: [
        { descripcion: "Horno Industrial", cantidad: 1, precio_u: 1500.00, costo_total: 1500.00 }
    ],
    costos_unitarios: [
        {
            id: 1,
            descripcion: "Pan de Masa Madre",
            insumos: [
                { descripcion: "Harina", unidad: "kg", cantidad: 0.3, precio_u: 1.00, costo_total: 0.30 },
                { descripcion: "Levadura", unidad: "gr", cantidad: 10, precio_u: 0.05, costo_total: 0.50 }
            ]
        }
    ],
    // 7.5 Detailed Financing
    inversion_inicial: [
        { descripcion: "Horno Industrial", valor: 1500.00, fuente: "Préstamo" },
        { descripcion: "Mesas de Trabajo", valor: 500.00, fuente: "Propia" },
        { descripcion: "Permisos", valor: 200.00, fuente: "Propia" }
    ],
    estructura_financiamiento: {
        propia: 700.00,
        prestamo: 1500.00,
        donacion: 0.00
    },
    // 7.6 Detailed Cash Flow (Calculated in Frontend, passed here for test)
    proyeccion_ingresos: {
        flujo_caja: [
            { anio: 0, entradas: 2200, salidas: 2200, flujoNeto: 0, acumulado: 0 },
            { anio: 1, entradas: 15000, salidas: 12000, utilidadBruta: 3000, partTrabajadores: 450, impRenta: 637.5, flujoNeto: 1912.5, acumulado: 1912.5 },
            { anio: 2, entradas: 16000, salidas: 12500, utilidadBruta: 3500, partTrabajadores: 525, impRenta: 743.75, flujoNeto: 2231.25, acumulado: 4143.75 },
            { anio: 3, entradas: 17000, salidas: 13000, utilidadBruta: 4000, partTrabajadores: 600, impRenta: 850, flujoNeto: 2550, acumulado: 6693.75 },
            { anio: 4, entradas: 18000, salidas: 13500, utilidadBruta: 4500, partTrabajadores: 675, impRenta: 956.25, flujoNeto: 2868.75, acumulado: 9562.5 },
            { anio: 5, entradas: 19000, salidas: 14000, utilidadBruta: 5000, partTrabajadores: 750, impRenta: 1062.5, flujoNeto: 3187.5, acumulado: 12750 }
        ]
    },
    indicadores_financieros: {
        van: 8500.00,
        tir: 32.5,
        payback: 1.2
    }
};

async function runVerification() {
    try {
        console.log("1. Creating Project (Phase 4 Test)...");
        const createRes = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sampleProject)
        });

        if (!createRes.ok) throw new Error(`Failed to create project: ${createRes.statusText}`);
        const project = await createRes.json();
        console.log("Project Created ID:", project.id);

        console.log("2. Generating Report...");
        const reportRes = await fetch(`${API_URL}/generate-report/${project.id}`);

        if (!reportRes.ok) throw new Error(`Failed to generate report: ${reportRes.statusText}`);

        const buffer = await reportRes.buffer();
        fs.writeFileSync(`test_report_phase4_${project.id}.docx`, buffer);
        console.log(`Report generated: test_report_phase4_${project.id}.docx (${buffer.length} bytes)`);

        console.log("VERIFICATION SUCCESSFUL");
    } catch (error) {
        console.error("VERIFICATION FAILED:", error);
        process.exit(1);
    }
}

runVerification();
