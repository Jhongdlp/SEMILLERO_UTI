import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Edit, Download, TrendingUp, Calendar, DollarSign, Moon, Sun } from 'lucide-react';

const Dashboard = ({ onCreateNew, onEdit, darkMode, toggleDarkMode }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

        try {
            const res = await fetch(`http://localhost:3001/api/projects/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const generateReport = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/generate-report/${id}`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `proyecto_${id}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const getPriorityBadge = (van) => {
        if (van > 10000) return { text: 'Alta Prioridad', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
        if (van > 5000) return { text: 'Media', color: 'bg-blue-100 text-blue-700 border-blue-300' };
        return { text: 'Baja', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-slate-50'} flex items-center justify-center`}>
                <div className="text-center">
                    <div className={`inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid ${darkMode ? 'border-slate-700 border-t-blue-400' : 'border-slate-300 border-t-blue-600'} motion-reduce:animate-[spin_1.5s_linear_infinite]`}></div>
                    <p className={`mt-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Cargando proyectos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-200`}>
            {/* Header */}
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-10 backdrop-blur-sm bg-opacity-90`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-lg`}>
                            <FileText className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                Semillero Empresarial UTI
                            </h1>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Gestión de Proyectos de Emprendimiento
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-colors ${darkMode
                                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={onCreateNew}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            <Plus size={20} />
                            Nuevo Proyecto
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border shadow-sm`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Total Proyectos</p>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mt-1`}>{projects.length}</p>
                            </div>
                            <div className={`p-3 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-lg`}>
                                <FileText className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                            </div>
                        </div>
                    </div>
                    <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border shadow-sm`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>VAN Promedio</p>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mt-1`}>
                                    ${projects.length > 0 ? (projects.reduce((sum, p) => sum + (p.indicadores_financieros?.van || 0), 0) / projects.length).toFixed(0) : '0'}
                                </p>
                            </div>
                            <div className={`p-3 ${darkMode ? 'bg-emerald-900' : 'bg-emerald-100'} rounded-lg`}>
                                <TrendingUp className={`${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} size={24} />
                            </div>
                        </div>
                    </div>
                    <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border shadow-sm`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Proyectos Viables</p>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mt-1`}>
                                    {projects.filter(p => (p.indicadores_financieros?.van || 0) > 0).length}
                                </p>
                            </div>
                            <div className={`p-3 ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} rounded-lg`}>
                                <DollarSign className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Table */}
                {projects.length === 0 ? (
                    <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl border p-12 text-center shadow-sm`}>
                        <FileText className={`mx-auto ${darkMode ? 'text-slate-600' : 'text-slate-300'} mb-4`} size={64} />
                        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                            No hay proyectos todavía
                        </h3>
                        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-6`}>
                            Comienza creando tu primer proyecto de emprendimiento
                        </p>
                        <button
                            onClick={onCreateNew}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            <Plus size={20} />
                            Crear Primer Proyecto
                        </button>
                    </div>
                ) : (
                    <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl border overflow-hidden shadow-sm`}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={`${darkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'} border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Proyecto</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Emprendedor</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">VAN</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">TIR</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Prioridad</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                                    {projects.map((project) => {
                                        const priority = getPriorityBadge(project.indicadores_financieros?.van || 0);
                                        return (
                                            <tr key={project.id} className={`${darkMode ? 'hover:bg-slate-750' : 'hover:bg-slate-50'} transition-colors`}>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                                            {project.titulo_proyecto || 'Sin título'}
                                                        </p>
                                                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} flex items-center gap-1 mt-1`}>
                                                            <Calendar size={14} />
                                                            {new Date(project.created_at).toLocaleDateString('es-ES')}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {project.nombre_emprendedor || '-'}
                                                </td>
                                                <td className={`px-6 py-4 text-right font-mono font-semibold ${(project.indicadores_financieros?.van || 0) > 0
                                                        ? (darkMode ? 'text-emerald-400' : 'text-emerald-600')
                                                        : (darkMode ? 'text-red-400' : 'text-red-600')
                                                    }`}>
                                                    ${(project.indicadores_financieros?.van || 0).toFixed(2)}
                                                </td>
                                                <td className={`px-6 py-4 text-right font-mono ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {project.indicadores_financieros?.tir
                                                        ? `${project.indicadores_financieros.tir.toFixed(2)}%`
                                                        : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${priority.color}`}>
                                                        {priority.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => onEdit(project.id)}
                                                            className={`p-2 rounded-lg transition-colors ${darkMode
                                                                    ? 'hover:bg-slate-700 text-slate-400 hover:text-blue-400'
                                                                    : 'hover:bg-blue-50 text-slate-500 hover:text-blue-600'
                                                                }`}
                                                            title="Editar"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => generateReport(project.id)}
                                                            className={`p-2 rounded-lg transition-colors ${darkMode
                                                                    ? 'hover:bg-slate-700 text-slate-400 hover:text-emerald-400'
                                                                    : 'hover:bg-emerald-50 text-slate-500 hover:text-emerald-600'
                                                                }`}
                                                            title="Generar Reporte"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProject(project.id)}
                                                            className={`p-2 rounded-lg transition-colors ${darkMode
                                                                    ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400'
                                                                    : 'hover:bg-red-50 text-slate-500 hover:text-red-600'
                                                                }`}
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
