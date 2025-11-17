import Turno from '../models/Turno.js';
import User from '../models/User.js';
import Paciente from '../models/Paciente.js';

/**
 * @desc    Crear un nuevo turno
 * @route   POST /api/turnos
 * @access  Private (Recepcionista)
 */
export const createTurno = async (req, res) => {
    const { paciente, medico, fecha, hora, motivo } = req.body;

    try {
        // Validación 1: Verificar que el paciente exista
        const pacienteExiste = await Paciente.findById(paciente);
        if (!pacienteExiste) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Validación 2: Verificar que el ID del médico exista y tenga rol 'medico'
        const medicoUser = await User.findById(medico);
        if (!medicoUser || medicoUser.rol !== 'medico') {
            return res.status(404).json({ message: 'Médico no encontrado o rol inválido' });
        }

        // Crear el turno
        const turno = await Turno.create({
            paciente,
            medico,
            fecha,
            hora,
            motivo,
            estado: 'PROGRAMADO', // [cite: 33]
        });

        res.status(201).json({ message: 'Turno creado exitosamente', turno });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

/**
 * @desc    Obtener todos los turnos (con filtros)
 * @route   GET /api/turnos
 * @access  Private (Recepcionista)
 */
export const getAllTurnos = async (req, res) => {
    const { medicoId, estado } = req.query; // Para filtros 

    try {
        let queryFilter = {};
        if (medicoId) queryFilter.medico = medicoId;
        if (estado) queryFilter.estado = estado;

        // .populate() reemplaza los ID con los datos de los documentos referenciados
        const turnos = await Turno.find(queryFilter)
            .populate('paciente', 'nombreCompleto CI') // Trae solo nombre y CI del paciente
            .populate('medico', 'nombre'); // Trae solo el nombre del médico

        res.status(200).json(turnos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

/**
 * @desc    Obtener los turnos del médico logueado
 * @route   GET /api/turnos/mis-turnos
 * @access  Private (Medico)
 */
export const getMisTurnos = async (req, res) => {
    try {
        // req.user.id viene del authMiddleware 
        const turnos = await Turno.find({ medico: req.user.id })
            .populate('paciente', 'nombreCompleto CI telefono')
            .sort({ fecha: 'asc' }); // Ordenarlos por fecha

        res.status(200).json(turnos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

/**
 * @desc    Cambiar el estado de un turno
 * @route   PATCH /api/turnos/:id/estado
 * @access  Private (Medico, Recepcionista)
 */
export const updateTurnoEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // El nuevo estado: ATENDIDO, CANCELADO [cite: 33]
    const { _id: userId, rol: userRole } = req.user;

    // Validar que el estado sea uno de los permitidos para cambiar
    if (!['ATENDIDO', 'CANCELADO'].includes(estado)) {
        return res.status(400).json({ message: 'Estado no válido' });
    }

    try {
        const turno = await Turno.findById(id);

        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        // Lógica de permisos
        if (userRole === 'medico') {
            // El médico solo puede modificar SUS turnos [cite: 38]
            if (turno.medico.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'No autorizado para modificar este turno' });
            }
            // El médico puede marcar como ATENDIDO o CANCELADO (Ausente) [cite: 20]
        }

        if (userRole === 'recepcionista') {
            // La recepcionista solo puede CANCELAR [cite: 37]
            if (estado !== 'CANCELADO') {
                return res.status(403).json({ message: 'Recepcionista solo puede cancelar turnos' });
            }
        }

        turno.estado = estado;
        await turno.save();

        res.status(200).json({ message: 'Estado del turno actualizado', turno });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};