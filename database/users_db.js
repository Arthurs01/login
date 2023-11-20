const mysql2 = require('mysql2')
const env = require('../.env')

const connection = mysql2.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME
})

connection.connect((err)=>{
    if(err){
        console.error('Error de conexion:' + err);
        return
    }
    console.log("Conexión Exitosa!")
})

module.exports = connection;