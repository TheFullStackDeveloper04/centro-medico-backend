import Paciente from '../models/Paciente.js';

/**
 * @desc    Registrar un nuevo paciente
 * @route   POST /api/pacientes
 * @access  Private (Recepcionista)
 */
export const createPaciente = async (req, res) => {
    // Obtenemos los datos del body
    const { nombreCompleto, CI, fechaNacimiento, telefono } = req.body;

    try {
        // Verificamos si el paciente ya existe por su Cédula de Identidad
        const pacienteExists = await Paciente.findOne({ CI });

        if (pacienteExists) {
            return res.status(400).json({ message: 'El paciente con esa CI ya existe' });
        }

        // Creamos el nuevo paciente
        const paciente = await Paciente.create({
            nombreCompleto,
            CI,
            fechaNacimiento,
            telefono,
        });

        res.status(201).json({
            message: 'Paciente registrado exitosamente',
            paciente,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

/**
 * @desc    Obtener listado de todos los pacientes
 * @route   GET /api/pacientes
 * @access  Private (Recepcionista, Medico)
 */
export const getPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find({}); // .find({}) trae todos
        res.status(200).json(pacientes);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};