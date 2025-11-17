import mongoose from 'mongoose';

const pacienteSchema = new mongoose.Schema({
    // Requisito: "nombre completo" 
    nombreCompleto: {
        type: String,
        required: true,
        trim: true,
    },

    // Requisito: "CI" (Cédula de Identidad) 
    CI: {
        type: String,
        required: true,
        unique: true, // Asumimos que la Cédula de Identidad debe ser única
        trim: true,
    },

    // Requisito: "fecha de nacimiento" 
    fechaNacimiento: {
        type: Date,
        required: true,
    },

    // Requisito: "teléfono" 
    telefono: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true // Añade createdAt y updatedAt
});

export default mongoose.model('Paciente', pacienteSchema);