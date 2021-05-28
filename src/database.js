const mysql = require("mysql");

const mysqlConnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1090279",
  database: "subastas",
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
