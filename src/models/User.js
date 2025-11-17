import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true, // Limpia espacios en blanco al inicio y al final
    },
    email: {
        type: String,
        required: true,
        unique: true, // Asegura que no haya dos usuarios con el mismo email
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,

    },
    rol: {
        type: String,
        required: true,
        enum: ['admin', 'recepcionista', 'medico'], // Solo permite estos valores
    }
}, {
    // timestamps: true añade automáticamente los campos createdAt y updatedAt
    timestamps: true
});

// ---- Middleware de Mongoose ----
// Esto se ejecutará ANTES ('pre') de que un documento se guarde ('save')
userSchema.pre('save', async function (next) {
    // Si la contraseña no se ha modificado, no hacemos nada y pasamos al siguiente middleware
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generamos el "salt", un texto aleatorio para añadir a la contraseña
        const salt = await bcrypt.genSalt(10); // 10 es el costo de hasheo

        // Hasheamos la contraseña combinándola con el salt
        this.password = await bcrypt.hash(this.password, salt);

        // Continuamos con el proceso de guardado
        next();

    } catch (error) {
        next(error); // Pasamos el error al manejador de errores
    }
});

// Exportamos el modelo para poder usarlo en otras partes de la app
export default mongoose.model('User', userSchema);