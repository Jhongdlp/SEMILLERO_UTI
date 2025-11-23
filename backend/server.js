const express = require('express');
const cors = require('cors');
const { sequelize, Project } = require('./setupDb');
const { generateReport } = require('./controllers/reportController');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// 0. Root Route (Health Check)
app.get('/', (req, res) => {
    res.send('✅ Backend del Semillero Empresarial UTI está corriendo correctamente.');
});

// 1. Create a new Project
app.post('/api/projects', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el proyecto' });
    }
});

// 2. Get all Projects (Optional, for list view)
app.get('/api/projects', async (req, res) => {
    const projects = await Project.findAll();
    res.json(projects);
});

// 2.1 Get single Project by ID
app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
});

// 2.2 Delete Project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        await project.destroy();
        res.json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
});

// 3. Generate Word Report
app.get('/api/generate-report/:id', generateReport);

// Start Server
const start = async () => {
    try {
        // Ensure DB is synced (alter: true updates schema without data loss)
        await sequelize.sync({ alter: true });
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

start();
