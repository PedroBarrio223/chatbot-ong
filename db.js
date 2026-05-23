const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "shortline.proxy.rlwy.net",
    user: "root",
    password: "SDJHSzpcbjGIjJoagDFTHMZDdXkHpfPZ",
    database: "railway",
    port: 50637
});

db.connect(err => {
    if (err) {
        console.log("Erro ao conectar", err);
    } else {
        console.log("Banco conectado");
    }
});

module.exports = db;
