import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const CashFlowChart = ({ data }) => {
    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="anio" label={{ value: 'Año', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="salidas" name="Egresos" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="flujoNeto" name="Flujo Neto" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export const InvestmentPieChart = ({ data }) => {
    // data format: [{ name: 'Propia', value: 100 }, { name: 'Préstamo', value: 200 }, ...]
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export const InfoTooltip = ({ text }) => (
    <div className="group relative inline-block ml-1">
        <div className="cursor-help text-slate-400 hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        </div>
        <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);
