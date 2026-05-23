const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "mysql.railway.internal",
    user: "root",
    password: "SDJHSzpcbjGIjJoagDFTHMZDdXkHpfPZ",
    database: "railway",
    port: 3306
});

db.connect(err => {
    if (err) {
        console.log("Erro ao conectar", err);
    } else {
        console.log("Banco conectado");
    }
});

module.exports = db;
