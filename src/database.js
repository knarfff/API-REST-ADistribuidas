const mysql = require("mysql");

const mysqlConnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1090279", // Contraseña de la db
  database: "subastas", // Nombre de la base de datos a usar
});

mysqlConnect.connect(function (err) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("DB is connected");
  }
});

module.exports = mysqlConnect;
