const db = require('../configs/db');

class Alumno {
    constructor({ id, nombre, apellidoPaterno, apellidoMaterno, matricula, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.matricula = matricula;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT id, nombre, apellidoPaterno, apellidoMaterno, matricula, deleted, createdAt, updatedAt, deletedAt FROM alumnos order by createdAt desc";

        if (sort && order) {
            query += ` ORDER BY ${sort} ${order}`;
        }

        if (offset >= 0 && limit) {
            query += ` LIMIT ${offset}, ${limit}`;
        }

        const [rows] = await connection.query(query);
        connection.end();

        return rows;
    }

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, nombre, apellidoPaterno, apellidoMaterno, matricula, deleted, createdAt, updatedAt, deletedAt FROM alumnos WHERE id = ?", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Alumno({
                id: row.id,
                nombre: row.nombre,
                apellidoPaterno: row.apellidoPaterno,
                apellidoMaterno: row.apellidoMaterno,
                matricula: row.matricula,
                deleted: row.deleted,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                deletedAt: row.deletedAt
            });
        }

        return null;
    }

  
    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM alumnos");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();

        const createdAt = new Date();
        const updatedAt = null;
        const [result] = await connection.execute("INSERT INTO alumnos (nombre, apellidoPaterno, apellidoMaterno, matricula, deleted, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)", [this.nombre, this.apellidoPaterno, this.apellidoMaterno, this.matricula, this.deleted, createdAt, updatedAt]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el alumno");
        }

        this.id = result.insertId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        return;
    }


    static async updateById(id, data) {
        const connection = await db.createConnection();
        const updatedAt = new Date();
        let updateQuery = "UPDATE alumnos SET updatedAt=?";
    
        const updateValues = [updatedAt];
    
        Object.keys(data).forEach(field => {
            updateQuery += `, ${field}=?`;
            updateValues.push(data[field]);
        });
    
        updateValues.push(id); 
        updateQuery += " WHERE id=?";
    
        const [result] = await connection.execute(updateQuery, updateValues);
        connection.end();
    
        if (result.affectedRows === 0) {
            throw new Error(`No se encontró ningún alumno con ID ${id}`);
        }
    
        return await Alumno.getById(id);  
    }
   

static async deleteById(id) {
    const connection = await db.createConnection();
    const updatedAt = new Date();
    const deletedAt = updatedAt;

    const [result] = await connection.execute("UPDATE alumnos SET deleted=?, updatedAt=?, deletedAt=? WHERE id=?", [true, updatedAt, deletedAt, id]);
    connection.end();

    if (result.affectedRows === 0) {
        throw new Error(`No se encontró ningún alumno con ID ${id}`);
    }

    return true; 
}

    
}

module.exports = Alumno;
