import { useState, useEffect } from 'react';
import ProjectForm from './components/ProjectForm';
import Dashboard from './components/Dashboard';

function App() {
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'form'
    const [editingId, setEditingId] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const handleCreateNew = () => {
        setEditingId(null);
        setView('form');
    };

    const handleEdit = (id) => {
        setEditingId(id);
        setView('form');
    };

    const handleBackToDashboard = () => {
        setView('dashboard');
        setEditingId(null);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
            {view === 'dashboard' ? (
                <Dashboard
                    onCreateNew={handleCreateNew}
                    onEdit={handleEdit}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                />
            ) : (
                <ProjectForm
                    onBack={handleBackToDashboard}
                    editingId={editingId}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                />
            )}
        </div>
    );
}

export default App;
