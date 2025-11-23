# 📊 Semillero Empresarial UTI - Plataforma de Planes de Negocio

Sistema integral para la creación, gestión y generación de planes de negocio diseñado para el Semillero Empresarial de la UTI (Universidad Tecnológica Indoamérica).

## ✨ Características Principales

### 🎯 Gestión de Proyectos
- **Dashboard Interactivo**: Visualiza todos tus proyectos con estadísticas en tiempo real
- **Indicadores Clave**: VAN, TIR, y Periodo de Recuperación calculados automáticamente
- **Priorización Inteligente**: Clasificación automática de proyectos según viabilidad financiera

### 📝 Formulario Completo
- **Interfaz por Pestañas**: Organización clara de la información del proyecto
- **Estructura Financiera Detallada**:
  - 7.1 Datos Generales (tasas de crecimiento e inflación)
  - 7.2 Demanda del Mercado
  - 7.3 Equipos y Muebles
  - 7.4 Costos Unitarios (productos con insumos anidados)
  - 7.5 Estructura de Financiamiento
  - 7.6 Proyecciones de Flujo de Caja (5 años)

### 📈 Visualizaciones Dinámicas
- **Gráficos Interactivos** (Recharts):
  - Evolución de flujo de caja (ingresos vs gastos)
  - Distribución de fuentes de financiamiento
- **Tooltips Educativos**: Explicaciones de términos financieros complejos

### 📄 Generación de Reportes
- **Exportación a Word**: Descarga planes de negocio completos en formato .docx
- **Plantilla Profesional**: Incluye todas las secciones y tablas del formulario

### 🌓 Modo Oscuro
- Interfaz moderna con soporte completo para tema claro y oscuro
- Preferencia guardada en localStorage
- Diseño adaptativo con paleta de colores profesional

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** - Framework de interfaz de usuario
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Utilidades CSS modernas
- **Recharts** - Gráficos interactivos
- **Lucide React** - Iconos SVG

### Backend
- **Node.js** + **Express** - Servidor API REST
- **Sequelize** - ORM para base de datos
- **SQLite** - Base de datos ligera y portable
- **Docxtemplater** - Generación de documentos Word
- **CORS** - Seguridad cross-origin

## 📋 Requisitos Previos

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

## 🛠️ Instalación

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd cobalt-lunar
```

### 2. Instalar Dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Generar la Plantilla de Word
```bash
cd backend
node createTemplate.js
```

## 💻 Uso

### Modo Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```
Servidor corriendo en: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Aplicación corriendo en: `http://localhost:5173`

### Producción

**Build del Frontend:**
```bash
cd frontend
npm run build
```

**Servir con Node:**
```bash
cd backend
node server.js
```

## 📁 Estructura del Proyecto

```
cobalt-lunar/
├── backend/
│   ├── controllers/
│   │   └── reportController.js    # Lógica de generación de reportes
│   ├── templates/
│   │   └── template.docx          # Plantilla Word generada
│   ├── createTemplate.js          # Script de generación de plantilla
│   ├── server.js                  # Servidor Express
│   ├── setupDb.js                 # Configuración Sequelize
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # Lista de proyectos
│   │   │   ├── ProjectForm.jsx    # Formulario principal
│   │   │   └── FinancialCharts.jsx # Componentes de gráficos
│   │   ├── utils/
│   │   │   └── financialCalculations.js # Cálculos financieros
│   │   ├── App.jsx                # Routing principal
│   │   ├── index.css              # Estilos globales
│   │   └── main.jsx               # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🎨 Características de UI/UX

### Dashboard
- Cards de estadísticas con métricas clave
- Tabla responsive con acciones rápidas
- Badges de prioridad por color
- Estados de carga elegantes

### Formulario
- Validación automática de campos
- Cálculos en tiempo real
- Tablas dinámicas con totales
- Productos con insumos anidados
- Tooltips informativos

### Temas
- **Modo Claro**: slate-50 / white / blue-600
- **Modo Oscuro**: slate-900 / slate-800 / blue-400

## 📊 Cálculos Financieros

El sistema calcula automáticamente:

- **VAN (Valor Actual Neto)**: Usando tasa de descuento configurable
- **TIR (Tasa Interna de Retorno)**: Método de aproximación por bisección
- **Payback Period**: Tiempo de recuperación de inversión
- **Flujo de Caja Proyectado**: 5 años con tasas de crecimiento
- **Depreciación**: Método lineal para activos fijos

## 🔧 API Endpoints

### Proyectos
- `GET /api/projects` - Listar todos los proyectos
- `GET /api/projects/:id` - Obtener proyecto específico
- `POST /api/projects` - Crear nuevo proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Reportes
- `GET /api/generate-report/:id` - Generar y descargar reporte Word

## 🐛 Solución de Problemas

### El template no se genera
```bash
cd backend
node createTemplate.js
```

### Error de CORS
Verifica que el backend esté corriendo en puerto 3001 y el frontend en 5173.

### Base de datos no actualizada
El servidor usa `sequelize.sync({ alter: true })` para actualizar automáticamente el schema.

## 📝 Próximas Mejoras

- [ ] Exportación de gráficos a Word
- [ ] Modo de edición en línea (inline editing)
- [ ] Historial de versiones de proyectos
- [ ] Comparación entre proyectos
- [ ] Templates personalizables
- [ ] Exportación a PDF

## 👥 Contribución

Este proyecto fue desarrollado para el Semillero Empresarial de la Universidad Tecnológica Indoamérica.

## 📄 Licencia

Todos los derechos reservados - UTI Business 2024

---

**Desarrollado con ❤️ para emprendedores ecuatorianos**
