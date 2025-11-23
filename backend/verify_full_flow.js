const fetch = require('node-fetch');
const fs = require('fs');

const API_URL = 'http://localhost:3001/api';

const sampleProject = {
    nombre_emprendedor: "Juan Perez",
    titulo_proyecto: "Dulces Artesanales",
    tasa_crecimiento_prod: "2.4",
    tasa_crecimiento_precio: "2.5",
    tasa_inflacion: "2.75",
    detalle_demanda: [
        { descripcion: "Dulce de Zambo", cantidad: 100, precio_u: 5.00, costo_total: 500.00 }
    ],
    detalle_equipos: [
        { descripcion: "Olla Industrial", cantidad: 1, precio_u: 200.00, costo_total: 200.00 }
    ],
    costos_unitarios: [
        {
            id: 1,
            descripcion: "Dulce de Zambo",
            insumos: [
                { descripcion: "Zambo", unidad: "kg", cantidad: 0.5, precio_u: 1.00, costo_total: 0.50 },
                { descripcion: "Azucar", unidad: "kg", cantidad: 0.2, precio_u: 2.00, costo_total: 0.40 }
            ]
        }
    ],
    inversion_inicial: [
        { descripcion: "Olla Industrial", valor: 200.00 },
        { descripcion: "Permisos", valor: 50.00 }
    ],
    proyeccion_ingresos: {
        ingresos: [6000, 6150, 6303, 6461, 6622],
        egresos: [4000, 4110, 4223, 4339, 4458],
        flujos: [2000, 2040, 2080, 2122, 2164]
    },
    indicadores_financieros: {
        van: 5000.50,
        tir: 25.4,
        payback: 1.5
    }
};

async function runVerification() {
    try {
        console.log("1. Creating Project...");
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
        fs.writeFileSync(`test_report_${project.id}.docx`, buffer);
        console.log(`Report generated: test_report_${project.id}.docx (${buffer.length} bytes)`);

        console.log("VERIFICATION SUCCESSFUL");
    } catch (error) {
        console.error("VERIFICATION FAILED:", error);
        process.exit(1);
    }
}

runVerification();
