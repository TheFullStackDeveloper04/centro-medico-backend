import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

// --- IMPORTAR RUTAS ---
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import pacienteRoutes from './src/routes/paciente.routes.js';
import turnoRoutes from './src/routes/turno.routes.js';


//  Cargar variables de entorno
dotenv.config();

//  Conectar a la base de datos
connectDB();

//  Inicializar la app de Express
const app = express();

//  Configurar Middlewares básicos
app.use(cors()); // Permite peticiones del frontend
app.use(express.json()); // Permite a Express entender JSON en el body de las peticiones

//  Definir el puerto
// Usamos el puerto de las variables de entorno, o el 4000 si no está definido
const PORT = process.env.PORT || 4000;

//  Ruta de prueba
// Para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('API del Centro Médico funcionando!');
});


// --- USAR RUTAS ---
// Cualquier petición a /api/auth será manejada por authRoutes
app.use('/api/auth', authRoutes);
// Cualquier petición a /api/users será manejada por userRoutes
app.use('/api/users', userRoutes);
// Cualquier petición a /api/pacientes será manejada por pacienteRoutes
app.use('/api/pacientes', pacienteRoutes);
// Cualquier petición a /api/turnos será manejada por turnoRoutes
app.use('/api/turnos', turnoRoutes);

//  Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});