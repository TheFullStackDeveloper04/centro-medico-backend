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

/**
 * @desc    Actualizar un paciente por ID
 * @route   PUT /api/pacientes/:id
 * @access  Private (Recepcionista)
 */
export const updatePaciente = async (req, res) => {
    const { id } = req.params;
    const { nombreCompleto, CI, fechaNacimiento, telefono } = req.body;

    try {
        // 1. Buscar el paciente por ID
        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // 2. Opcional: Verificar que la CI (si se cambia) no exista en otro paciente
        if (CI && CI !== paciente.CI) {
            const ciExists = await Paciente.findOne({ CI });
            if (ciExists) {
                return res.status(400).json({ message: 'Esa CI ya está registrada para otro paciente' });
            }
        }

        // 3. Actualizar los campos
        paciente.nombreCompleto = nombreCompleto || paciente.nombreCompleto;
        paciente.CI = CI || paciente.CI;
        paciente.fechaNacimiento = fechaNacimiento || paciente.fechaNacimiento;
        paciente.telefono = telefono || paciente.telefono;

        // 4. Guardar los cambios
        const pacienteActualizado = await paciente.save();

        res.status(200).json({
            message: 'Paciente actualizado exitosamente',
            paciente: pacienteActualizado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

/**
 * @desc    Eliminar un paciente por ID
 * @route   DELETE /api/pacientes/:id
 * @access  Private (Recepcionista)
 */
export const deletePaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Nota: Deberíamos considerar qué pasa con los turnos asociados a este paciente.
        // Por ahora, solo eliminamos al paciente.
        await Paciente.findByIdAndDelete(id);

        res.status(200).json({ message: 'Paciente eliminado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};