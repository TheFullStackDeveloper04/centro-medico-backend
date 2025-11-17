import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../src/config/db.js';

// Importar los modelos
import User from '../src/models/User.js';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

// Conectar a la base de datos
connectDB();

// Datos del administrador
const adminUser = {
  nombre: 'Administrador del Sistema',
  email: 'admin@dominio.com',
  password: 'MeGustaElPan123', 
  rol: 'admin',
};

const importData = async () => {
  try {
    // 1. Limpiar la colección de usuarios (para evitar duplicados si lo corremos de nuevo)
    await User.deleteMany();

    // 2. Insertar el usuario admin
    // NOTA: El middleware 'pre-save' de User.js se ejecutará
    // automáticamente para hashear la contraseña.
    await User.create(adminUser);

    console.log('Datos importados exitosamente (Admin creado)');
    process.exit(); // Termina el script con éxito

  } catch (error) {
    console.error('Error al importar datos:', error);
    process.exit(1); // Termina el script con error
  }
};

// Lógica para ejecutar el script
// Si ejecutamos 'node seeder/seeder.js -d', borraría datos (no lo implementamos aún)
// Si ejecutamos 'node seeder/seeder.js', importará datos.
if (process.argv[2] === '-d') {
  // destroyData(); // Aún no implementado
} else {
  importData();
}