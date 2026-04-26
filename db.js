const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "shuttle.proxy.rlwy.net",
    user: "root",
    password: "PpjtIDVEYZseRJdmszeCIEoZyqRtVtjI",
    database: "railway",
    port: 12039
});

db.connect(err => {
    if (err) {
        console.log("Erro ao conectar:", err);
    } else {
        console.log("Banco conectado 🚀");
    }
});

module.exports = db;
