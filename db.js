const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.log("❌ Erro ao conectar no banco:", err);
    } else {
        console.log("✅ Banco conectado com sucesso!");
    }
});

module.exports = db;
