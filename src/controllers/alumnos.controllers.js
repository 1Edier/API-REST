const Alumno = require('../models/alumnos.models');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const { sort, order } = req.query;

        const alumnos = await Alumno.getAll({ offset, limit }, { sort, order });

        const totalAlumnos = await Alumno.count();

        let response = {
            message: "alumnos obtenidos exitosamente",
            data: alumnos,
            total: totalAlumnos,
            totalPages: Math.ceil(totalAlumnos / limit),
            currentPage: page
        };

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al obtener los alumnos",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idAlumno = req.params.id;
        const alumno = await Alumno.getById(idAlumno);

        if (!alumno) {
            return res.status(404).json({
                message: `alumno no encontrado`
            });
        };
        return res.status(200).json({
            id: alumno.id, nombre: alumno.nombre, apellidoPaterno: alumno.apellidoPaterno, apellidoMaterno: alumno.apellidoMaterno, matricula: alumno.matricula, deleted: alumno.deleted, createdAt: alumno.createdAt, updatedAt: alumno. updatedAt, deletedAt: alumno.deletedAt
        });
    } catch (error) {
        return res.status(404).json({
            message: "ocurrió un error al obtener el alumno",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const alumno = new Alumno({
            nombre: req.body.nombre,
            apellidoPaterno: req.body.apellidoPaterno,
            apellidoMaterno: req.body.apellidoMaterno,
            matricula: req.body.matricula,
            deleted: req.body.deleted || false
        });
        console.log(req.body);

        console.log(alumno);
        await alumno.save();

        return res.status(201).json({
            message: "alumno creado exitosamente",
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
        });
    }
}


const updateById = async (req, res) => {
    try {
        const idAlumno = req.params.id;
        const alumnoExistente = await Alumno.getById(idAlumno);

        if (!alumnoExistente) {
            return res.status(404).json({
                message: `Alumno no encontrado`
            });
        }

        const dataToUpdate = {}; 

     
        ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'matricula', 'deleted'].forEach(field => {
            if (req.body[field] !== undefined) {
                dataToUpdate[field] = req.body[field];
            }
        });

        await Alumno.updateById(idAlumno, dataToUpdate);

        return res.status(200).json({
            message: "alumno actualizado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al actualizar el alumno",
            error: error.message
        });
    }
}
const deleteById = async (req, res) => {
    try {
        const idAlumno = req.params.id;
        const deleted = await Alumno.deleteById(idAlumno);

        if (!deleted) {
            return res.status(404).json({
                message: `Alumno no encontrado`
            });
        }

        return res.status(200).json({
            message: "alumno eliminado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al borrar el alumno",
            error: error.message
        });
    }
}

module.exports = {
    index,
    getById,
    create,
    updateById,
    deleteById 
}
