import mongoose from 'mongoose';

const turnoSchema = new mongoose.Schema({
    // --- Conexión con Paciente ---
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente', // Le dice a Mongoose que busque en la colección 'Paciente'
        required: true,
    },

    // --- Conexión con Médico (que es un User) ---
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Le dice a Mongoose que busque en la colección 'User'
        required: true,
    },

    // --- Campos del Turno (Requisitos) ---
    fecha: {
        type: Date,
        required: true,
    },

    hora: {
        type: String, // Guardaremos la hora como un string (ej. "10:30")
        required: true,
    },

    motivo: {
        type: String,
        required: true,
        trim: true,
    },

    estado: {
        type: String,
        required: true,
        enum: ['PROGRAMADO', 'ATENDIDO', 'CANCELADO'], // Solo permite estos valores [cite: 33]
        default: 'PROGRAMADO', // Por defecto, un turno nuevo está programado
    }
}, {
    timestamps: true // Añade createdAt y updatedAt
});

export default mongoose.model('Turno', turnoSchema);