const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
// The database file will be created in the current directory as 'database.sqlite'
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false // Disable logging for cleaner output
});

// Define the Project Model
const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Basic Info
    nombre_emprendedor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    titulo_proyecto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resumen_canvas: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // Financial Data - Stored as JSON strings for flexibility with SQLite

    // 7.1 Datos Generales (Tasas)
    datos_generales: {
        type: DataTypes.JSON,
        defaultValue: {}
    },

    // 7.2 Detalle de Demanda
    detalle_demanda: {
        type: DataTypes.JSON,
        defaultValue: []
    },

    // 7.3 Detalle de Equipos
    detalle_equipos: {
        type: DataTypes.JSON,
        defaultValue: []
    },

    // 7.4 Costos Unitarios
    costos_unitarios: {
        type: DataTypes.JSON,
        defaultValue: []
    },

    // 7.5 Inversión Inicial (Now part of Estructura Financiamiento mostly, but kept for compatibility or specific table)
    inversion_inicial: {
        type: DataTypes.JSON,
        defaultValue: []
    },

    // 7.5 Estructura Financiamiento (Detailed breakdown)
    estructura_financiamiento: {
        type: DataTypes.JSON,
        defaultValue: {}
    },

    // 7.6 & 7.7 Proyecciones (Ingresos, EERR)
    proyeccion_ingresos: {
        type: DataTypes.JSON,
        defaultValue: {}
    },

    // 7.8 Indicadores Financieros
    indicadores_financieros: {
        type: DataTypes.JSON,
        defaultValue: {}
    }
});

// Sync function to create tables
const setupDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to SQLite has been established successfully.');

        // Force: true will drop the table if it exists (useful for development/reset)
        // Remove { force: true } in production to avoid data loss
        await sequelize.sync({ force: true });
        console.log('Database & tables created!');

        // Optional: Create a dummy record to verify
        await Project.create({
            nombre_emprendedor: 'Juan Pérez',
            titulo_proyecto: 'Dulces de Zambo',
            resumen_canvas: 'Venta de dulces tradicionales...',
            inversion_inicial: [
                { concepto: 'Maquinaria', valor: 5000, fuente: 'Propia' },
                { concepto: 'Adecuaciones', valor: 2000, fuente: 'Préstamo' }
            ],
            costos_unitarios: [
                { item: 'Azúcar', unidad: 'kg', cantidad: 10, precio_u: 1.5, costo_total: 15 }
            ]
        });
        console.log('Dummy project created successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// Run the setup if this script is executed directly
if (require.main === module) {
    setupDb();
}

module.exports = { sequelize, Project };
