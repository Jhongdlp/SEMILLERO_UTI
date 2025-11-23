# Semillero Empresarial UTI Business Platform

**Plataforma de Gestión de Proyectos de Emprendimiento**

Generado automáticamente el 2025-11-23 17:14:07

---

## 📋 Descripción del Proyecto

Sistema completo para la gestión y evaluación financiera de proyectos de emprendimiento, desarrollado para el Semillero Empresarial de la Universidad Técnica de Ibarra (UTI).

### Características Principales

✅ **Dashboard Interactivo** - Gestión visual de proyectos con estadísticas clave  
✅ **Análisis Financiero Completo** - Cálculo automático de VAN, TIR, y Payback  
✅ **Generación de Reportes Word** - Exportación profesional de planes de negocio  
✅ **Gráficos Interactivos** - Visualización de flujos de caja y estructura financiera  
✅ **Modo Oscuro** - Interfaz adaptable con persistencia de preferencias  
✅ **Estructura de Costos Anidada** - Productos con ingredientes y cálculo automático  

---

## 🗂️ Estructura del Proyecto

```
cobalt-lunar/
├── backend/
│   ├── server.js                 # Servidor Express principal
│   ├── setupDb.js               # Configuración de base de datos SQLite
│   ├── createTemplate.js        # Generador de plantilla Word
│   ├── controllers/
│   │   └── reportController.js  # Lógica de generación de reportes
│   ├── templates/
│   │   └── template.docx        # Plantilla Word (generada)
│   └── database.sqlite          # Base de datos SQLite
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # Componente raíz con routing
    │   ├── components/
    │   │   ├── Dashboard.jsx    # Vista de lista de proyectos
    │   │   ├── ProjectForm.jsx  # Formulario principal
    │   │   └── FinancialCharts.jsx  # Componentes de gráficos
    │   └── utils/
    │       └── financialCalculations.js  # Lógica de cálculos
    └── public/
```

---

## 📊 Estructura de Datos

### Modelo de Base de Datos (SQLite)

#### Tabla: `projects`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER PRIMARY KEY | ID único del proyecto |
| `nombre_emprendedor` | TEXT | Nombre del emprendedor |
| `titulo_proyecto` | TEXT | Título del proyecto |
| `tasa_crecimiento_prod` | REAL | Tasa de crecimiento en producción (%) |
| `tasa_crecimiento_precio` | REAL | Tasa de crecimiento en precios (%) |
| `tasa_inflacion` | REAL | Tasa de inflación esperada (%) |
| `detalle_demanda` | JSON | Array de productos con demanda y precios |
| `detalle_equipos` | JSON | Array de equipos y muebles |
| `costos_unitarios` | JSON | Array anidado de productos e insumos |
| `inversion_inicial` | JSON | Array de rubros con fuente de financiamiento |
| `gastos_operativos` | JSON | Objeto con gastos mensuales |
| `proyeccion_ingresos` | JSON | Objeto con flujos de caja proyectados |
| `indicadores_financieros` | JSON | Objeto con VAN, TIR, Payback |
| `estructura_financiamiento` | JSON | Distribución de fuentes (propia, préstamo, donación) |
| `created_at` | DATETIME | Fecha de creación |
| `updated_at` | DATETIME | Última actualización |

---

## 📐 Sección 7: Módulo Financiero

El sistema maneja 9 subsecciones financieras detalladas:

### 7.1 Datos Generales

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `tasa_crecimiento_prod` | REAL | 2.40 | Crecimiento anual de producción (%) |
| `tasa_crecimiento_precio` | REAL | 2.50 | Crecimiento anual de precios (%) |
| `tasa_inflacion` | REAL | 2.75 | Inflación anual esperada (%) |

### 7.2 Detalle de Demanda

**Estructura JSON:**
```json
[
  {
    "id": 1,
    "descripcion": "Producto A",
    "cantidad": 100,
    "precio_u": 15.00,
    "costo_total": 1500.00
  }
]
```

| Campo | Descripción |
|-------|-------------|
| `descripcion` | Nombre del producto |
| `cantidad` | Demanda mensual (unidades) |
| `precio_u` | Precio de venta unitario ($) |
| `costo_total` | Venta total mensual (auto-calculado) |

### 7.3 Detalle de Equipos y Muebles

**Estructura JSON:**
```json
[
  {
    "id": 1,
    "descripcion": "Horno Industrial",
    "cantidad": 1,
    "precio_u": 1500.00,
    "costo_total": 1500.00
  }
]
```

### 7.4 Costos Unitarios (Estructura Anidada)

**Estructura JSON:**
```json
[
  {
    "id": 1,
    "descripcion": "Dulce de Zambo",
    "insumos": [
      {
        "id": 1,
        "descripcion": "Zambo",
        "unidad": "kg",
        "cantidad": 0.5,
        "precio_u": 2.00,
        "costo_total": 1.00
      },
      {
        "id": 2,
        "descripcion": "Azúcar",
        "unidad": "kg",
        "cantidad": 0.3,
        "precio_u": 1.50,
        "costo_total": 0.45
      }
    ]
  }
]
```

**Cálculo Automático:**
- `costo_total` (insumo) = `cantidad` × `precio_u`
- `costo_unitario` (producto) = Σ `costo_total` de todos los insumos

### 7.5 Estructura de Financiamiento

**Estructura JSON:**
```json
[
  {
    "id": 1,
    "descripcion": "Equipos de Producción",
    "valor": 2000.00,
    "fuente": "Préstamo"
  },
  {
    "id": 2,
    "descripcion": "Capital de Trabajo",
    "valor": 500.00,
    "fuente": "Propia"
  }
]
```

**Fuentes disponibles:**
- `Propia` - Inversión del emprendedor
- `Préstamo` - Financiamiento bancario
- `Donación` - Recursos no reembolsables

**Cálculos automáticos:**
```javascript
estructura_financiamiento = {
  propia: Σ(valor donde fuente === 'Propia'),
  prestamo: Σ(valor donde fuente === 'Préstamo'),
  donacion: Σ(valor donde fuente === 'Donación')
}
```

### 7.6 Proyección de Ingresos (Flujo de Caja)

**Gastos Operativos Mensuales:**
```json
{
  "sueldos": 500.00,
  "servicios": 50.00,
  "mantenimiento": 30.00,
  "publicidad": 20.00,
  "otros": 10.00
}
```

**Flujo de Caja Proyectado (Años 0-5):**
```json
{
  "flujo_caja": [
    {
      "anio": 0,
      "entradas": 2200.00,
      "salidas": 2200.00,
      "flujoNeto": 0.00,
      "acumulado": 0.00
    },
    {
      "anio": 1,
      "entradas": 15000.00,
      "salidas": 12000.00,
      "utilidadBruta": 3000.00,
      "partTrabajadores": 450.00,
      "impRenta": 637.50,
      "flujoNeto": 1912.50,
      "acumulado": 1912.50
    }
  ]
}
```

**Cálculos del Flujo de Caja:**
```
Año 0:
  Entradas = Total Financiamiento (propia + préstamo + donación)
  Salidas = Inversión Inicial Total
  Flujo Neto = Entradas - Salidas

Años 1-5:
  Ingresos = Demanda × Precio × 12 × (1 + tasa_crecimiento_precio)^año
  Costos Producción = Costo Unitario × Demanda × 12 × (1 + tasa_inflacion)^año
  Gastos Operativos = Gastos Mensuales × 12 × (1 + tasa_inflacion)^año
  
  Utilidad Bruta = Ingresos - Costos - Gastos
  15% Trabajadores = max(0, Utilidad Bruta × 0.15)
  25% Imp. Renta = max(0, (Utilidad Bruta - 15% Trabajadores) × 0.25)
  
  Flujo Neto = Ingresos - Costos - Gastos - 15% - 25%
  Acumulado = Acumulado(año anterior) + Flujo Neto
```

### 7.7 Capital de Trabajo

_(Calculado automáticamente)_

### 7.8 Indicadores Financieros

**Estructura JSON:**
```json
{
  "van": 8500.00,
  "tir": 32.5,
  "payback": "1.2 años"
}
```

**Fórmulas:**

1. **VAN (Valor Actual Neto):**
```
VAN = -Inversión_Inicial + Σ(Flujo_Neto_i / (1 + tasa_descuento)^i)
Tasa de descuento = 12.93%
```

2. **TIR (Tasa Interna de Retorno):**
```
TIR = tasa donde VAN = 0
(Calculada usando Newton-Raphson)
```

3. **Payback (Periodo de Recuperación):**
```
Año donde Flujo_Acumulado >= Inversión_Inicial
```

### 7.9 Análisis de Sensibilidad

_(Pendiente)_

---

## 🔌 API Endpoints

### Backend Server (Express)

**Base URL:** `http://localhost:3001/api`

#### Proyectos

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `GET` | `/projects` | Listar todos los proyectos | - |
| `GET` | `/projects/:id` | Obtener proyecto por ID | - |
| `POST` | `/projects` | Crear nuevo proyecto | JSON del proyecto |
| `PUT` | `/projects/:id` | Actualizar proyecto | JSON del proyecto |
| `DELETE` | `/projects/:id` | Eliminar proyecto | - |

#### Reportes

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| `GET` | `/generate-report/:id` | Generar reporte Word | Binary (docx) |

**Ejemplo de Request POST /projects:**
```json
{
  "nombre_emprendedor": "María López",
  "titulo_proyecto": "Panadería Gourmet",
  "tasa_crecimiento_prod": "2.40",
  "tasa_crecimiento_precio": "2.50",
  "tasa_inflacion": "2.75",
  "detalle_demanda": [...],
  "costos_unitarios": [...],
  "inversion_inicial": [...],
  "gastos_operativos": {},
  "indicadores_financieros": {
    "van": 8500,
    "tir": 32.5,
    "payback": "1.2 años"
  },
  "proyeccion_ingresos": {
    "flujo_caja": [...]
  },
  "estructura_financiamiento": {
    "propia": 500,
    "prestamo": 1500,
    "donacion": 200
  }
}
```

---

## 🎨 UI Components

### Dashboard

**Características:**
- ✅ Tarjetas de estadísticas (Total, VAN Promedio, Viables)
- ✅ Tabla con todos los proyectos
- ✅ **Badges de Prioridad:**
  - 🟢 Alta: VAN > $10,000
  - 🔵 Media: VAN > $5,000
  - ⚫ Baja: VAN < $5,000
- ✅ Acciones: Editar, Eliminar, Generar Reporte

### ProjectForm

**Pestañas:**
1. **General** - Datos básicos y tasas
2. **Mercado & Costos** - Demanda, Equipos, Costos Unitarios (anidados)
3. **Inversión** - Equipos, Estructura de Financiamiento
4. **Proyecciones** - Gastos, Indicadores, Gráficos, Flujo de Caja

**Componentes Reutilizables:**
- `Card` - Contenedor con estilos dark mode
- `CardHeader` - Encabezado con icono
- `Input` - Campo de entrada con label
- `Button` - Botón con 4 variantes (primary, outline, danger, ghost)
- `TabButton` - Botón de pestaña
- `DynamicTable` - Tabla dinámica con CRUD inline
- `InfoTooltip` - Tooltip educativo para términos financieros

### Financial Charts (Recharts)

1. **CashFlowChart** - Gráfico de líneas (Ingresos, Egresos, Flujo Neto)
2. **InvestmentPieChart** - Gráfico de pastel (Fuentes de financiamiento)

---

## 🌓 Modo Oscuro

**Paleta de Colores:**

| Elemento | Modo Claro | Modo Oscuro |
|----------|------------|-------------|
| Fondo principal | `slate-50` (#f8fafc) | `slate-900` (#0f172a) |
| Tarjetas | `white` (#ffffff) | `slate-800` (#1e293b) |
| Bordes | `slate-200` (#e2e8f0) | `slate-700` (#334155) |
| Texto principal | `slate-900` | `white` |
| Texto secundario | `slate-500` | `slate-400` |
| Inputs fondo | `white` | `slate-900` |
| Inputs borde | `slate-300` | `slate-600` |
| Hover | `slate-50` | `slate-700/50` |

**Persistencia:**
- localStorage key: `darkMode`
- Toggle en ambas vistas (Dashboard y Form)

---

## 🚀 Instalación y Uso

### Requisitos Previos

- Node.js >= 16.x
- npm >= 8.x

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd cobalt-lunar
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

### Ejecutar el Proyecto

#### Backend (Terminal 1)
```bash
cd backend
npm start
```
Servidor corriendo en: `http://localhost:3001`

#### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Interfaz disponible en: `http://localhost:5173`

### Generación de Plantilla Word

El backend genera automáticamente la plantilla Word al iniciar. Para regenerarla:

```bash
cd backend
node createTemplate.js
```

Esto crea `backend/templates/template.docx` con todas las secciones del plan de negocio.

---

## 📦 Dependencias

### Backend

```json
{
  "express": "^4.18.2",
  "sequelize": "^6.35.0",
  "sqlite3": "^5.1.6",
  "docxtemplater": "^3.42.0",
  "pizzip": "^3.1.6",
  "docx": "^8.5.0",
  "cors": "^2.8.5"
}
```

### Frontend

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.292.0",
  "recharts": "^3.5.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.3.5"
}
```

---

## 🧪 Verificación

### Scripts de Prueba

**Verificar Fase 4 (Tablas Detalladas):**
```bash
cd backend
node verify_phase4.js
```

Este script:
1. Crea un proyecto de prueba con datos completos
2. Genera un reporte Word
3. Guarda el archivo como `test_report_phase4_<id>.docx`

---

## 📝 Convenciones de Código

### Nombrado de Variables

- **camelCase** para variables y funciones JavaScript
- **snake_case** para campos de base de datos
- **PascalCase** para componentes React

### Estructura de Componentes React

```javascript
const ComponentName = ({ prop1, prop2, darkMode = false }) => {
    // State
    const [state, setState] = useState(initialValue);
    
    // Effects
    useEffect(() => {
        // Side effects
    }, [dependencies]);
    
    // Handlers
    const handleAction = () => {
        // Logic
    };
    
    // Render
    return (
        <div className={`base-classes ${darkMode ? 'dark-classes' : 'light-classes'}`}>
            {/* JSX */}
        </div>
    );
};
```

---

## 🛠️ Desarrollo

### Agregar Nueva Sección Financiera

1. **Actualizar setupDb.js** - Agregar columna JSON si es necesaria
2. **Actualizar ProjectForm.jsx** - Crear tab y componentes UI
3. **Actualizar financialCalculations.js** - Agregar lógica de cálculo
4. **Actualizar createTemplate.js** - Agregar sección en plantilla Word
5. **Actualizar reportController.js** - Mapear datos al template

### Debugging

**Backend:**
```bash
# Ver logs del servidor
cd backend
npm start

# Revisar base de datos
sqlite3 database.sqlite
.schema projects
SELECT * FROM projects;
```

**Frontend:**
```bash
# Modo desarrollo con hot reload
cd frontend
npm run dev

# Build de producción
npm run build
```

---

## 📄 Licencia

Este proyecto fue desarrollado para el Semillero Empresarial de la Universidad Técnica de Ibarra (UTI).

---

## 👥 Contacto y Soporte

Para preguntas o soporte:
- Email: [contacto@uti.edu.ec]
- GitHub Issues: [repo-url/issues]

---

**Última actualización:** 2025-11-23
