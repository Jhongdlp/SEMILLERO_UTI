import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Save, DollarSign, TrendingUp, PieChart, Activity, ArrowRight, ArrowLeft, Moon, Sun } from 'lucide-react';
import { projectValue, calculateDepreciation, calculateVAN, calculateTIR, calculatePayback } from '../utils/financialCalculations';
import { CashFlowChart, InvestmentPieChart, InfoTooltip } from './FinancialCharts';

// --- UI Components ---

const Card = ({ children, className = "", darkMode = false }) => (
    <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ title, subtitle, icon: Icon, darkMode = false }) => (
    <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'} flex items-center gap-3`}>
        {Icon && <div className={`p-2 ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'} rounded-lg`}><Icon size={20} /></div>}
        <div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
            {subtitle && <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>{subtitle}</p>}
        </div>
    </div>
);

const Input = ({ value, onChange, placeholder, type = "text", className = "", label, darkMode = false }) => (
    <div className="space-y-1">
        {label && <label className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider`}>{label}</label>}
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 ${darkMode ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className}`}
        />
    </div>
);

const Button = ({ onClick, children, variant = "primary", className = "", darkMode = false }) => {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
        outline: darkMode
            ? "border border-slate-600 hover:bg-slate-700 text-slate-300"
            : "border border-slate-300 hover:bg-slate-50 text-slate-700",
        danger: darkMode
            ? "bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800"
            : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
        ghost: darkMode
            ? "hover:bg-slate-700 text-slate-400"
            : "hover:bg-slate-100 text-slate-600"
    };
    return (
        <button onClick={onClick} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

const TabButton = ({ active, onClick, children, icon: Icon, darkMode = false }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all ${active
            ? (darkMode ? 'border-blue-500 text-blue-400 bg-blue-900/30' : 'border-blue-600 text-blue-600 bg-blue-50/50')
            : (darkMode ? 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50')
            }`}
    >
        {Icon && <Icon size={16} />}
        {children}
    </button>
);

// --- Dynamic Table ---

const DynamicTable = ({ data, onChange, columns, darkMode = false }) => {
    const addRow = () => {
        const newRow = columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), { id: Date.now() });
        onChange([...data, newRow]);
    };

    const removeRow = (id) => onChange(data.filter(row => row.id !== id));

    const updateRow = (id, field, value) => {
        const updatedData = data.map(row => {
            if (row.id === id) {
                const newRow = { ...row, [field]: value };
                // Auto-calc totals
                if (field === 'cantidad' || field === 'precio_u') {
                    const qty = parseFloat(field === 'cantidad' ? value : row.cantidad) || 0;
                    const price = parseFloat(field === 'precio_u' ? value : row.precio_u) || 0;
                    newRow.costo_total = (qty * price).toFixed(2);
                }
                return newRow;
            }
            return row;
        });
        onChange(updatedData);
    };

    const calculateTotal = (key) => data.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0).toFixed(2);

    return (
        <div className={`w-full overflow-hidden rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <table className="w-full text-sm text-left">
                <thead className={`${darkMode ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200'} font-semibold border-b`}>
                    <tr>
                        {columns.map((col) => <th key={col.key} className="px-4 py-3">{col.label}</th>)}
                        <th className="px-4 py-3 w-16 text-center"></th>
                    </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                    {data.map((row) => (
                        <tr key={row.id} className={`${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50/50'}`}>
                            {columns.map((col) => (
                                <td key={col.key} className="p-2">
                                    {col.readOnly ? (
                                        <div className={`px-3 py-2 ${darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-600'} rounded-lg font-mono text-right`}>
                                            {col.type === 'currency' && '$ '}{row[col.key]}
                                        </div>
                                    ) : col.type === 'select' ? (
                                        <select
                                            value={row[col.key]}
                                            onChange={(e) => updateRow(row.id, col.key, e.target.value)}
                                            className={`w-full px-3 py-2 ${darkMode ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        >
                                            <option value="">Seleccione...</option>
                                            {col.options.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Input
                                            type={col.type === 'number' || col.type === 'currency' ? 'number' : 'text'}
                                            value={row[col.key]}
                                            onChange={(e) => updateRow(row.id, col.key, e.target.value)}
                                            className={col.type === 'currency' ? 'text-right font-mono' : ''}
                                            darkMode={darkMode}
                                        />
                                    )}
                                </td>
                            ))}
                            <td className="p-2 text-center">
                                <button onClick={() => removeRow(row.id)} className={`p-2 ${darkMode ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'} rounded-full transition-colors`}>
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className={`${darkMode ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'} font-semibold border-t`}>
                    <tr>
                        {columns.map((col) => (
                            <td key={col.key} className="px-4 py-3 text-right">
                                {col.hasTotal && <span className={`font-mono ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>${calculateTotal(col.key)}</span>}
                            </td>
                        ))}
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            <div className={`p-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border-t`}>
                <Button onClick={addRow} variant="outline" className="w-full justify-center border-dashed" darkMode={darkMode}><Plus size={18} /> Agregar Fila</Button>
            </div>
        </div>
    );
};

// --- Main Form ---

export default function ProjectForm({ onBack, editingId, darkMode = false, toggleDarkMode }) {
    const [activeTab, setActiveTab] = useState(0);
    const [data, setData] = useState({
        nombre_emprendedor: '',
        titulo_proyecto: '',
        // 7.1 Datos Generales
        tasa_crecimiento_prod: '2.40',
        tasa_crecimiento_precio: '2.50',
        tasa_inflacion: '2.75',
        // 7.2 Demanda
        detalle_demanda: [],
        // 7.3 Equipos
        detalle_equipos: [],
        // 7.4 Costos (Nested: [{ id, descripcion, insumos: [] }])
        costos_unitarios: [],
        // 7.5 Financiamiento (Detailed)
        inversion_inicial: [],
        // 7.6 Proyecciones (Detailed Expenses)
        gastos_operativos: {
            sueldos: '0',
            servicios: '0',
            mantenimiento: '0',
            publicidad: '0',
            otros: '0'
        }
    });

    // --- Helpers for Nested Costos ---
    const addProduct = () => {
        setData(prev => ({
            ...prev,
            costos_unitarios: [
                ...prev.costos_unitarios,
                { id: Date.now(), descripcion: '', insumos: [] }
            ]
        }));
    };

    const removeProduct = (productId) => {
        setData(prev => ({
            ...prev,
            costos_unitarios: prev.costos_unitarios.filter(p => p.id !== productId)
        }));
    };

    const updateProduct = (productId, field, value) => {
        setData(prev => ({
            ...prev,
            costos_unitarios: prev.costos_unitarios.map(p =>
                p.id === productId ? { ...p, [field]: value } : p
            )
        }));
    };

    const updateIngredients = (productId, newInsumos) => {
        setData(prev => ({
            ...prev,
            costos_unitarios: prev.costos_unitarios.map(p =>
                p.id === productId ? { ...p, insumos: newInsumos } : p
            )
        }));
    };

    // --- Calculations ---
    const projections = useMemo(() => {
        // Safety checks
        const inversionList = data.inversion_inicial || [];
        const demandaList = data.detalle_demanda || [];
        const costosList = data.costos_unitarios || [];
        const gastosOps = data.gastos_operativos || {};

        // 1. Calculate Total Initial Investment & Financing Structure
        const inversionTotal = inversionList.reduce((sum, item) => sum + (parseFloat(item.valor) || 0), 0);

        const financiamiento = inversionList.reduce((acc, item) => {
            const val = parseFloat(item.valor) || 0;
            if (item.fuente === 'Propia') acc.propia += val;
            else if (item.fuente === 'Préstamo') acc.prestamo += val;
            else if (item.fuente === 'Donación') acc.donacion += val;
            return acc;
        }, { propia: 0, prestamo: 0, donacion: 0 });

        // 2. Base Annual Revenue (Year 1)
        const ingresosBase = demandaList.reduce((sum, item) => {
            return sum + ((parseFloat(item.cantidad) || 0) * (parseFloat(item.precio_u) || 0) * 12);
        }, 0);

        // 3. Base Annual Costs (Year 1)
        const costosBase = costosList.reduce((totalSum, product) => {
            const unitCost = (product.insumos || []).reduce((sum, insumo) => sum + (parseFloat(insumo.costo_total) || 0), 0);
            const demandItem = demandaList.find(d => d.descripcion?.trim().toLowerCase() === product.descripcion?.trim().toLowerCase());
            const quantity = demandItem ? (parseFloat(demandItem.cantidad) || 0) : 0;
            return totalSum + (unitCost * quantity * 12);
        }, 0);

        // 4. Base Operating Expenses (Year 1)
        const gastosBase = Object.values(gastosOps).reduce((sum, val) => sum + (parseFloat(val) || 0), 0) * 12;

        // 5. Projections (Years 1-5)
        const ingresosProyectados = projectValue(ingresosBase, parseFloat(data.tasa_crecimiento_precio || 0));
        const costosProyectados = projectValue(costosBase, parseFloat(data.tasa_inflacion || 0));
        const gastosProyectados = projectValue(gastosBase, parseFloat(data.tasa_inflacion || 0));

        // 6. Detailed Cash Flow (Year 0 to 5)
        const flujoCaja = [];

        // Year 0
        flujoCaja.push({
            anio: 0,
            entradas: financiamiento.propia + financiamiento.prestamo + financiamiento.donacion, // Total Financing
            salidas: inversionTotal,
            flujoNeto: (financiamiento.propia + financiamiento.prestamo + financiamiento.donacion) - inversionTotal,
            acumulado: (financiamiento.propia + financiamiento.prestamo + financiamiento.donacion) - inversionTotal
        });

        let acumulado = (financiamiento.propia + financiamiento.prestamo + financiamiento.donacion) - inversionTotal;

        for (let i = 0; i < 5; i++) {
            const ingresos = ingresosProyectados[i] || 0;
            const costos = costosProyectados[i] || 0;
            const gastos = gastosProyectados[i] || 0;

            const utilidadBruta = ingresos - costos - gastos;

            // Taxes
            const partTrabajadores = utilidadBruta > 0 ? utilidadBruta * 0.15 : 0;
            const utilidadAntesImp = utilidadBruta - partTrabajadores;
            const impRenta = utilidadAntesImp > 0 ? utilidadAntesImp * 0.25 : 0;

            const salidasTotales = costos + gastos + partTrabajadores + impRenta;
            const flujoNeto = ingresos - salidasTotales;

            acumulado += flujoNeto;

            flujoCaja.push({
                anio: i + 1,
                entradas: ingresos,
                salidas: salidasTotales,
                utilidadBruta,
                partTrabajadores,
                impRenta,
                flujoNeto,
                acumulado
            });
        }

        // 7. Indicators (using Net Flow from Years 1-5)
        const flujosPuros = flujoCaja.slice(1).map(f => f.flujoNeto);
        const van = calculateVAN(12.93, inversionTotal, flujosPuros);
        const tir = calculateTIR(inversionTotal, flujosPuros);
        const payback = calculatePayback(inversionTotal, flujosPuros);

        return { inversionTotal, financiamiento, flujoCaja, van, tir, payback, ingresosProyectados, costosProyectados, flujos: flujosPuros };
    }, [data]);

    const updateField = (field, value) => setData(prev => ({ ...prev, [field]: value }));
    const updateGasto = (field, value) => setData(prev => ({ ...prev, gastos_operativos: { ...prev.gastos_operativos, [field]: value } }));

    const handleSubmit = async () => {
        const payload = {
            ...data,
            indicadores_financieros: {
                van: projections.van,
                tir: projections.tir,
                payback: projections.payback
            },
            proyeccion_ingresos: {
                flujo_caja: projections.flujoCaja
            },
            estructura_financiamiento: projections.financiamiento
        };

        try {
            const res = await fetch('http://localhost:3001/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) alert("Proyecto guardado exitosamente!");
            else alert("Error al guardar");
        } catch (e) {
            console.error(e);
            alert("Error de conexión");
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-200`}>
            {/* Header */}
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-10 backdrop-blur-sm bg-opacity-90`}>
                <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                            title="Volver al Dashboard"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                            </h1>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Semillero Empresarial UTI Business</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-8">

                {/* Tabs */}
                <div className={`flex border-b ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} mb-6 rounded-t-xl px-2`}>
                    <TabButton darkMode={darkMode} active={activeTab === 0} onClick={() => setActiveTab(0)} icon={Activity}>1. General</TabButton>
                    <TabButton darkMode={darkMode} active={activeTab === 1} onClick={() => setActiveTab(1)} icon={PieChart}>2. Mercado & Costos</TabButton>
                    <TabButton darkMode={darkMode} active={activeTab === 2} onClick={() => setActiveTab(2)} icon={DollarSign}>3. Inversión</TabButton>
                    <TabButton darkMode={darkMode} active={activeTab === 3} onClick={() => setActiveTab(3)} icon={TrendingUp}>4. Proyecciones</TabButton>
                </div>

                <div className="space-y-8">

                    {/* TAB 1: GENERAL */}
                    {activeTab === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card darkMode={darkMode} className="md:col-span-2">
                                <CardHeader darkMode={darkMode} title="Información Básica" />
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input darkMode={darkMode} label="Nombre Emprendedor" value={data.nombre_emprendedor} onChange={e => updateField('nombre_emprendedor', e.target.value)} />
                                    <Input darkMode={darkMode} label="Título Proyecto" value={data.titulo_proyecto} onChange={e => updateField('titulo_proyecto', e.target.value)} />
                                </div>
                            </Card>
                            <Card darkMode={darkMode}>
                                <CardHeader darkMode={darkMode} title="7.1 Datos Financieros (Tasas %)" />
                                <div className="p-6 grid grid-cols-2 gap-4">
                                    <Input darkMode={darkMode} label="Crecimiento Producción" value={data.tasa_crecimiento_prod} onChange={e => updateField('tasa_crecimiento_prod', e.target.value)} type="number" />
                                    <Input darkMode={darkMode} label="Crecimiento Precios" value={data.tasa_crecimiento_precio} onChange={e => updateField('tasa_crecimiento_precio', e.target.value)} type="number" />
                                    <Input darkMode={darkMode} label="Inflación" value={data.tasa_inflacion} onChange={e => updateField('tasa_inflacion', e.target.value)} type="number" />
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* TAB 2: MERCADO & COSTOS */}
                    {activeTab === 1 && (
                        <div className="space-y-6">
                            <Card darkMode={darkMode}>
                                <CardHeader darkMode={darkMode} title="7.2 Detalle de Demanda (Mensual)" subtitle="Productos y precios de venta al público." />
                                <div className="p-6">
                                    <DynamicTable darkMode={darkMode}
                                        columns={[
                                            { key: 'descripcion', label: 'Producto', type: 'text' },
                                            { key: 'cantidad', label: 'Demanda Mensual', type: 'number' },
                                            { key: 'precio_u', label: 'Precio Venta ($)', type: 'currency' },
                                            { key: 'costo_total', label: 'Venta Total Mensual', type: 'currency', readOnly: true, hasTotal: true }
                                        ]}
                                        data={data.detalle_demanda}
                                        onChange={v => updateField('detalle_demanda', v)}
                                    />
                                </div>
                            </Card>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>7.4 Costos Unitarios</h3>
                                    <Button darkMode={darkMode} onClick={addProduct} variant="outline"><Plus size={18} /> Agregar Producto</Button>
                                </div>

                                {data.costos_unitarios.map((prod, index) => (
                                    <Card darkMode={darkMode} key={prod.id} className={`border-l-4 ${darkMode ? 'border-l-blue-400' : 'border-l-blue-500'}`}>
                                        <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'} flex items-center justify-between`}>
                                            <div className="flex-1 max-w-md">
                                                <Input
                                                    darkMode={darkMode}
                                                    value={prod.descripcion}
                                                    onChange={(e) => updateProduct(prod.id, 'descripcion', e.target.value)}
                                                    placeholder="Nombre del Producto"
                                                    className="font-semibold text-lg"
                                                />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Costo Unitario</p>
                                                    <p className={`text-lg font-mono font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                        ${(prod.insumos || []).reduce((sum, i) => sum + (parseFloat(i.costo_total) || 0), 0).toFixed(2)}
                                                    </p>
                                                </div>
                                                <button onClick={() => removeProduct(prod.id)} className={`p-2 ${darkMode ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'} rounded-full transition-colors`}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <DynamicTable darkMode={darkMode}
                                                columns={[
                                                    { key: 'descripcion', label: 'Ingrediente / Insumo', type: 'text' },
                                                    { key: 'unidad', label: 'Unidad', type: 'text' },
                                                    { key: 'cantidad', label: 'Cantidad', type: 'number' },
                                                    { key: 'precio_u', label: 'Costo Unitario ($)', type: 'currency' },
                                                    { key: 'costo_total', label: 'Subtotal ($)', type: 'currency', readOnly: true, hasTotal: true }
                                                ]}
                                                data={prod.insumos || []}
                                                onChange={newInsumos => updateIngredients(prod.id, newInsumos)}
                                            />
                                        </div>
                                    </Card>
                                ))}
                                {data.costos_unitarios.length === 0 && (
                                    <div className={`text-center py-12 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl border border-dashed ${darkMode ? 'border-slate-600 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                                        <p>No hay productos definidos para costos.</p>
                                        <Button darkMode={darkMode} onClick={addProduct} variant="outline" className="mt-4 mx-auto">Agregar Primer Producto</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: INVERSIÓN */}
                    {activeTab === 2 && (
                        <div className="space-y-6">
                            <Card darkMode={darkMode}>
                                <CardHeader darkMode={darkMode} title="7.3 Detalle de Equipos y Muebles" />
                                <div className="p-6">
                                    <DynamicTable darkMode={darkMode}
                                        columns={[
                                            { key: 'descripcion', label: 'Descripción', type: 'text' },
                                            { key: 'cantidad', label: 'Cantidad', type: 'number' },
                                            { key: 'precio_u', label: 'Precio Unitario ($)', type: 'currency' },
                                            { key: 'costo_total', label: 'Total ($)', type: 'currency', readOnly: true, hasTotal: true }
                                        ]}
                                        data={data.detalle_equipos}
                                        onChange={v => updateField('detalle_equipos', v)}
                                    />
                                </div>
                            </Card>
                            <Card darkMode={darkMode}>
                                <CardHeader darkMode={darkMode} title="7.5 Estructura de Financiamiento" subtitle="Defina el rubro, valor y la fuente de financiamiento." />
                                <div className="p-6">
                                    <DynamicTable darkMode={darkMode}
                                        columns={[
                                            { key: 'descripcion', label: 'Rubro / Categoría', type: 'text' },
                                            { key: 'valor', label: 'Valor ($)', type: 'currency', hasTotal: true },
                                            { key: 'fuente', label: 'Fuente', type: 'select', options: ['Propia', 'Préstamo', 'Donación'] }
                                        ]}
                                        data={data.inversion_inicial}
                                        onChange={v => updateField('inversion_inicial', v)}
                                    />
                                    <div className={`mt-4 grid grid-cols-3 gap-4 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} p-4 rounded-lg border`}>
                                        <div className="text-center">
                                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Inversión Propia</p>
                                            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>${projections.financiamiento.propia.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Préstamo</p>
                                            <p className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>${projections.financiamiento.prestamo.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Donación</p>
                                            <p className={`text-lg font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>${projections.financiamiento.donacion.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* TAB 4: PROYECCIONES */}
                    {activeTab === 3 && (
                        <div className="space-y-6">
                            <Card darkMode={darkMode}>
                                <CardHeader darkMode={darkMode} title="Gastos Operativos Mensuales (Año 1)" subtitle="Ingrese los gastos mensuales estimados." />
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Input darkMode={darkMode} label="Sueldos y Salarios" value={data.gastos_operativos.sueldos} onChange={e => updateGasto('sueldos', e.target.value)} type="number" />
                                    <Input darkMode={darkMode} label="Servicios Básicos" value={data.gastos_operativos.servicios} onChange={e => updateGasto('servicios', e.target.value)} type="number" />
                                    <Input darkMode={darkMode} label="Mantenimiento" value={data.gastos_operativos.mantenimiento} onChange={e => updateGasto('mantenimiento', e.target.value)} type="number" />
                                    <Input darkMode={darkMode} label="Publicidad" value={data.gastos_operativos.publicidad} onChange={e => updateGasto('publicidad', e.target.value)} type="number" />
                                    <Input darkMode={darkMode} label="Otros Gastos" value={data.gastos_operativos.otros} onChange={e => updateGasto('otros', e.target.value)} type="number" />
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card darkMode={darkMode} className="bg-blue-50 border-blue-100">
                                    <div className="p-6 text-center">
                                        <div className="flex items-center justify-center">
                                            <p className="text-sm text-blue-600 font-medium uppercase">VAN</p>
                                            <InfoTooltip text="Valor Actual Neto: Mide la rentabilidad del proyecto considerando el valor del dinero en el tiempo. Un VAN positivo indica que el proyecto es rentable." />
                                        </div>
                                        <p className="text-3xl font-bold text-blue-900 mt-2">${projections.van.toFixed(2)}</p>
                                    </div>
                                </Card>
                                <Card darkMode={darkMode} className="bg-emerald-50 border-emerald-100">
                                    <div className="p-6 text-center">
                                        <div className="flex items-center justify-center">
                                            <p className="text-sm text-emerald-600 font-medium uppercase">TIR</p>
                                            <InfoTooltip text="Tasa Interna de Retorno: Representa la rentabilidad porcentual del proyecto. Si TIR > tasa de descuento, el proyecto es viable." />
                                        </div>
                                        <p className="text-3xl font-bold text-emerald-900 mt-2">
                                            {projections.tir !== null ? `${projections.tir.toFixed(2)}%` : 'N/A'}
                                        </p>
                                    </div>
                                </Card>
                                <Card darkMode={darkMode} className="bg-purple-50 border-purple-100">
                                    <div className="p-6 text-center">
                                        <div className="flex items-center justify-center">
                                            <p className="text-sm text-purple-600 font-medium uppercase">Payback</p>
                                            <InfoTooltip text="Periodo de Recuperación: Tiempo que tarda el proyecto en recuperar la inversión inicial." />
                                        </div>
                                        <p className="text-xl font-bold text-purple-900 mt-2">
                                            {typeof projections.payback === 'number'
                                                ? `${projections.payback.toFixed(2)} años`
                                                : projections.payback}
                                        </p>
                                    </div>
                                </Card>
                            </div>

                            {/* Visual Analytics */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card darkMode={darkMode}>
                                    <CardHeader darkMode={darkMode} title="Proyección de Flujo de Caja" subtitle="Evolución de ingresos, egresos y flujo neto en 5 años" icon={TrendingUp} />
                                    <div className="p-6">
                                        <CashFlowChart data={projections.flujoCaja.map(f => ({
                                            anio: `Año ${f.anio}`,
                                            ingresos: f.entradas,
                                            salidas: f.salidas,
                                            flujoNeto: f.flujoNeto
                                        }))} />
                                    </div>
                                </Card>
                                <Card darkMode={darkMode}>
                                    <CardHeader darkMode={darkMode} title="Estructura de Financiamiento" subtitle="Distribución de fuentes de inversión" icon={PieChart} />
                                    <div className="p-6">
                                        <InvestmentPieChart data={[
                                            { name: 'Inversión Propia', value: projections.financiamiento.propia },
                                            { name: 'Préstamo', value: projections.financiamiento.prestamo },
                                            { name: 'Donación', value: projections.financiamiento.donacion }
                                        ].filter(item => item.value > 0)} />
                                    </div>
                                </Card>
                            </div>

                            {/* Detailed Cash Flow Table */}
                            <Card darkMode={darkMode}>
                                <CardHeader darkMode={darkMode} title="Flujo de Caja Detallado" subtitle="Proyección año por año" />
                                <div className="p-6 overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left">Concepto</th>
                                                {projections.flujoCaja.map(f => (
                                                    <th key={f.anio} className="px-4 py-3 text-right">Año {f.anio}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="px-4 py-3 font-medium">Entradas</td>
                                                {projections.flujoCaja.map(f => (
                                                    <td key={f.anio} className="px-4 py-3 text-right font-mono text-green-600">${f.entradas.toFixed(2)}</td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium">Salidas</td>
                                                {projections.flujoCaja.map(f => (
                                                    <td key={f.anio} className="px-4 py-3 text-right font-mono text-red-600">${f.salidas.toFixed(2)}</td>
                                                ))}
                                            </tr>
                                            <tr className={darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}>
                                                <td className="px-4 py-3 font-bold">Flujo Neto</td>
                                                {projections.flujoCaja.map(f => (
                                                    <td key={f.anio} className="px-4 py-3 text-right font-mono font-bold text-blue-600">${f.flujoNeto.toFixed(2)}</td>
                                                ))}
                                            </tr>
                                            <tr className={darkMode ? 'bg-slate-800' : 'bg-slate-100'}>
                                                <td className="px-4 py-3 font-bold">Acumulado</td>
                                                {projections.flujoCaja.map(f => (
                                                    <td key={f.anio} className="px-4 py-3 text-right font-mono font-bold">${f.acumulado.toFixed(2)}</td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            <Card darkMode={darkMode}>
                                <CardHeader darkMode={darkMode} title="7.6 Proyección de Ingresos (Flujo de Caja)" />
                                <div className="p-6 overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3">Rubro</th>
                                                <th className="px-4 py-3 text-right">Año 0</th>
                                                <th className="px-4 py-3 text-right">Año 1</th>
                                                <th className="px-4 py-3 text-right">Año 2</th>
                                                <th className="px-4 py-3 text-right">Año 3</th>
                                                <th className="px-4 py-3 text-right">Año 4</th>
                                                <th className="px-4 py-3 text-right">Año 5</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="px-4 py-3 font-medium">Entradas (Ingresos)</td>
                                                {projections.flujoCaja.map((f, i) => (
                                                    <td key={i} className="px-4 py-3 text-right text-emerald-600 font-mono">${f.entradas.toFixed(2)}</td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium">Salidas (Costos+Gastos)</td>
                                                {projections.flujoCaja.map((f, i) => (
                                                    <td key={i} className="px-4 py-3 text-right text-red-500 font-mono">${f.salidas.toFixed(2)}</td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium pl-8 text-slate-500">15% Trabajadores</td>
                                                {projections.flujoCaja.map((f, i) => (
                                                    <td key={i} className="px-4 py-3 text-right text-slate-500 font-mono">${(f.partTrabajadores || 0).toFixed(2)}</td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium pl-8 text-slate-500">25% Imp. Renta</td>
                                                {projections.flujoCaja.map((f, i) => (
                                                    <td key={i} className="px-4 py-3 text-right text-slate-500 font-mono">${(f.impRenta || 0).toFixed(2)}</td>
                                                ))}
                                            </tr>
                                            <tr className="bg-slate-50 font-bold">
                                                <td className="px-4 py-3">Flujo Neto</td>
                                                {projections.flujoCaja.map((f, i) => (
                                                    <td key={i} className="px-4 py-3 text-right text-slate-800 font-mono">${f.flujoNeto.toFixed(2)}</td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    )}

                    <div className="flex justify-end pt-6 border-t border-slate-200">
                        <Button darkMode={darkMode} onClick={handleSubmit} className="px-8 py-3 text-lg shadow-xl">
                            <Save size={20} /> Guardar Proyecto
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
