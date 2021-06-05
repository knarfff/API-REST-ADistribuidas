var mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "agustin123",
  database: "subastas",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Conectado");
  var nuevoPostulante =
    "INSERT INTO personas (documento, nombre, direccion, foto, correo, nacionalidad) VALUES ?;";
  var valuesPostulantes = [
    [
      "41394861",
      "Franco Belloni",
      "Buenos Aires",
      "FotoFranco",
      "fbelloni@gmail.com",
      "Argentina",
    ],
    [
      "41387541",
      "Omar Cuarterolo",
      "Rosario",
      "FotoOmar",
      "ocuarterolo@gmail.com",
      "España",
    ],
    [
      "32487514",
      "Paula Sarasa",
      "Mendoza",
      "FotoPaula",
      "psarasa@gmail.com",
      "Itala",
    ],
  ];
  con.query(nuevoPostulante, [valuesPostulantes], function (err, result) {
    if (err) throw err;
    console.log(`Se añadieron ${result.affectedRows} postulantes`);
  });
});

var nuevoMetodoDePago =
  "INSERT INTO metododepago (idMetodo, nombreMetodo, duenio, numeroTarjeta, codigoSeguridad, vencimiento, tipoTarjeta, tarjeta, banco, cbu, alias, numeroCuenta, cuit, tipoMetodo, estado) VALUES ?;";
var valuesMetodoDePago = [
  [
    1,
    "Tarjeta familiar",
    1,
    "123456",
    55555,
    "2021-03-08",
    "nacional",
    "VISA",
    "Santander",
    "0123456789987654321",
    "FrancoB",
    "1",
    "12313132",
    "tarjeta",
    "Bien",
  ],
  [
    2,
    "Tarjeta unitaria",
    3,
    "654321",
    44444,
    "2021-03-08",
    "internacional",
    "VISA",
    "Patagoina",
    "0789789789798789789",
    "PaulaS",
    "2",
    "324242424",
    "tarjeta",
    "Bien++",
  ],
];
con.query(nuevoMetodoDePago, [valuesMetodoDePago], function (err, result) {
  if (err) throw err;
  console.log(`Se añadieron ${result.affectedRows} metodos de pago`);
});

var nuevoSubastador =
  "INSERT INTO subastadores (identificador, matricula, region) VALUES ?;";
var valuesSubastadores = [
  [1, "fr4nc0", "Argentina"],
  [2, "cu4rt3r0l0", "España"],
  [3, "p4ul4", "Italia"],
];
con.query(nuevoSubastador, [valuesSubastadores], function (err, result) {
  if (err) throw err;
  console.log(`Se añadieron ${result.affectedRows} subastadores`);
});

var nuevoEmpleado =
  "INSERT INTO empleados (identificador, cargo, sector) VALUES ?;";
var valuesEmpleados = [
  [1, "Mantenimiento", 4],
  [2, "Mantenimiento", 3],
  [3, "Mantenimiento", 6],
];
con.query(nuevoEmpleado, [valuesEmpleados], function (err, result) {
  if (err) throw err;
  console.log(`Se añadieron ${result.affectedRows} empleados`);
});

var nuevoDuenio =
  "INSERT INTO duenios (identificador, numeroPais, verificacionFinanciera, verificacionJudicial, calificacionRiesgo, verificador) VALUES ?;";
var valuesDuenios = [
  [1, 8, "Si", "Si", 10, 1],
  [2, 4, "Si", "Si", 10, 1],
  [3, 2, "Si", "Si", 10, 1],
];
con.query(nuevoDuenio, [valuesDuenios], function (err, result) {
  if (err) throw err;
  console.log(`Se añadieron ${result.affectedRows} dueños`);
});

var nuevaSubasta =
  "INSERT INTO subastas (identificador, titulo, fecha, hora, estado, subastador, ubicacion, capacidadAsistentes, tieneDeposito, seguridadPropia, categoria) VALUES ?;";
var valuesSubastas = [
  [
    1,
    "Arte Antiguo",
    "2021/05/31",
    "17:33:10",
    "iniciada",
    1,
    "España",
    3,
    "Si",
    "Si",
    "comun",
  ],
  [
    2,
    "Arte Moderno",
    "2021/05/31",
    "17:33:10",
    "finalizada",
    1,
    "Argentina",
    4,
    "Si",
    "Si",
    "plata",
  ],
  [
    3,
    "Ropa",
    "2021/05/31",
    "17:33:10",
    "espera",
    3,
    "Italia",
    5,
    "Si",
    "Si",
    "oro",
  ],
];
con.query(nuevaSubasta, [valuesSubastas], function (err, result) {
  if (err) throw err;
  console.log(`Se añadieron ${result.affectedRows} subastas`);
});

var nuevoCatalogo =
  "INSERT INTO catalogos (identificador, descripcion, subasta, responsable) VALUES ?;";
var valuesCatalogos = [
  [1, "Arte Moderno", 2, 1],
  [2, "Arte Antiguo", 1, 1],
  [3, "Ropa", 3, 1],
];
con.query(nuevoCatalogo, [valuesCatalogos], function (err, result) {
  if (err) throw err;
  console.log(`Se añadieron ${result.affectedRows} catalogos`);
});

var nuevoProducto =
  "INSERT INTO productos (identificador, fecha, disponible, descripcionCatalogo, descripcionCompleta, revisor, duenio, artista, fechaArte, historia, tipo) VALUES ?;";
var valuesProductos = [
  [
    1,
    "2021/05/31",
    "Si",
    "Arte Antiguo",
    "Arte del siglo 10",
    2,
    2,
    "Juan",
    "2021/05/31",
    "Historia del arte antiguo",
    "Raro",
  ],
  [
    2,
    "2021/05/31",
    "Si",
    "Arte Antiguo",
    "Arte del siglo 11",
    2,
    2,
    "Gaston",
    "2021/05/31",
    "Historia del arte antiguo v2",
    "Super Raro",
  ],
  [
    3,
    "2021/05/31",
    "Si",
    "Arte Moderno",
    "Arte del siglo 21",
    1,
    1,
    "Ernesto",
    "2021/05/31",
    "Historia del arte moderno",
    "Común",
  ],
  [
    4,
    "2021/05/31",
    "Si",
    "Ropa",
    "Ropa buena",
    1,
    1,
    "Fernando",
    "2021/05/31",
    "Historia de la ropa",
    "Rare",
  ],
];
con.query(nuevoProducto, [valuesProductos], function (err, result) {
  if (err) throw err;
  console.log(`Se añadieron ${result.affectedRows} productos`);
});

var nuevaSubastaProducto =
  "INSERT INTO subastaProducto (identificador, producto, ultimaOferta, dateTimeUltimaOferta, documentoUltimaOferta, precioVenta, estado) VALUES ?;";
var valuesSubastaProductos = [
  [1, 2, 58.12, "2021/05/31", "41394861", 50, "iniciada"],
  [2, 1, 64.12, "2021/05/31", "41394862", 55, "espera"],
  [3, 3, 100.12, "2021/05/31", "41394863", 70, "finalizada"],
  [4, 4, 698.12, "2021/05/31", "41394864", 500, "iniciada"],
];
con.query(nuevaSubastaProducto, [valuesSubastaProductos], (err, result) => {
  if (err) throw err;
  console.log(`Se añadieron ${result.affectedRows} subastasProductos`);
});

var nuevoItemCatalogo =
  "INSERT INTO itemscatalogo (identificador, nombre, catalogo, producto, precioBase, moneda, comision, subastado, fotoCatalogo, estado) VALUES ?;";
var valuesItemscatalogos = [
  [
    1,
    "Pintura muy vieja",
    2,
    1,
    55,
    "dolar",
    1,
    "Si",
    "https://img.milanuncios.com/fg/2006/56/200656478_3.jpg",
    "espera",
  ],
  [2, "Pintura viejisima", 2, 2, 65, "peso", 1, "Si", "https://i.pinimg.com/474x/61/ee/df/61eedf76e79f53efab2b90d35b35341f.jpg", "iniciada"],
  [3, "Ropa elegante", 3, 4, 55, "dolar", 1, "Si", "https://i.ytimg.com/vi/7aCVPTGAEzM/maxresdefault.jpg", "finalizada"],
  [4, "Arte de ayer", 1, 3, 65, "peso", 1, "Si", "https://www.bellasartes.gob.ar/media/uploads/coleccion/7755.jpg", "iniciada"],
];
con.query(nuevoItemCatalogo, [valuesItemscatalogos], (err, result) => {
  if (err) throw err;
  console.log(`Se añadieron ${result.affectedRows} itemsCatalogos`);
});

var nuevaFoto = "INSERT INTO fotos (identificador, producto, foto) VALUES ?;";
var valuesFotos = [
  [1, 1, "https://img.milanuncios.com/fg/2006/56/200656478_3.jpg"],
  [2, 1, "https://cloud10.todocoleccion.online/arte-pintura-oleo/tc/2017/03/12/18/79634277.jpg"],
  [3, 2, "https://i.pinimg.com/474x/61/ee/df/61eedf76e79f53efab2b90d35b35341f.jpg"],
];
con.query(nuevaFoto, [valuesFotos], (err, result) => {
  if (err) throw err;
  console.log(`Se añadieron ${result.affectedRows} fotos`);
});
