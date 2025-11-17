// src/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Leer la URI de conexión desde las variables de entorno
    const MONGODB_URI = process.env.MONGODB_URI;

    // Añadimos una comprobación por si acaso
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI no está definida. Revisa tu archivo .env');
    }

    await mongoose.connect(MONGODB_URI);
    
    console.log('MongoDB conectado exitosamente.');

  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;