const e = require("express");
const { Router } = require("express");
const express = require("express");
const router = express.Router();
const randomstring = require("randomstring");


const mysqlConnect = require("../database");

// GET ALL FROM TABLE personas
router.get("/personas", (req, res) => {
  mysqlConnect.query("SELECT * FROM personas", (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Permite registrar los datos de un postulante a usuario.

router.post("/usuario/nuevoPostulante", (req, res) => {
  const { documento, nombre, direccion, foto, correo, nacionalidad } = req.body;
  console.log({ foto, direccion });
  const query = `CALL add_postulante(?, ?, ?, ?, ?, ?);`;
  mysqlConnect.query(
    query,
    [documento, nombre, direccion, foto, correo, nacionalidad],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          code: 201,
          data: {},
          message: "Se registra correctamente al usuario.",
        });
      } else if (err) {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error en la creación del postulante",
        });
      }
    }
  );
});

// Permite validar que un número de documento no haya sido registrado previamente

router.post("/usuario/validarDocumento", (req, res) => {
  const { documento } = req.body;
  mysqlConnect.query(
    "SELECT * FROM personas WHERE documento = ?;",
    [documento],
    (err, rows, fields) => {
      if (!err) {
        console.log(rows);
        if (rows == 0) {
          res.json({
            code: 204,
            data: {},
            message: "El documento no fue registrado",
          });
        } else {
          res.json({
            code: 409,
            data: {},
            message: "El documento ya fue registrado previamente",
          });
        }
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error",
        });
      }
    }
  );
});

// Permite validar que un correo electrónico no haya sido registrado previamente

router.post("/usuario/validarCorreo", (req, res) => {
  const { correo } = req.body;
  mysqlConnect.query(
    "SELECT * FROM personas WHERE correo = ?;",
    [correo],
    (err, rows, fields) => {
      if (!err) {
        console.log(rows);
        if (rows == 0) {
          res.json({
            code: 204,
            data: {},
            message: "El correo no fue registrado",
          });
        } else {
          res.json({
            code: 409,
            data: {},
            message: "El correo ya fue registrado previamente",
          });
        }
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error",
        });
      }
    }
  );
});

// Permite recuperar la información de perfil de un usuario por documento

router.post("/usuario/getUsuario", (req, res) => {
  
  const { documento } = req.body;
  console.log(documento)
  mysqlConnect.query(
    "SELECT * FROM personas WHERE documento = ?;",
    [documento],
    (err, rows, fields) => {
      if (!err) {
        if (rows[0] !== undefined) {
          rows[0].foto=rows[0].foto.toString();
          res.json({
            code: 200,
            data: rows[0],
            message: "Se devuelve la información del usuario",
          });
        } else if (rows == 0) {
          res.json({
            code: 404,
            data: {},
            message:
              "No existe un usuario con ese número de documento. Respuesta vacía",
          });
        }
      }
      if (err) {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error",
        });
      }
    }
  );
});

// Permite recuperar la información de perfil de un usuario por correo

router.post("/usuario/getUsuarioPorCorreo", (req, res) => {
  const { correo } = req.body;
  mysqlConnect.query(
    "SELECT * FROM personas WHERE correo = ?",
    [correo],
    (err, rows, fields) => {
      if (!err) {
        console.log(rows[0])
        if (rows[0] !== undefined) {
          rows[0].foto=rows[0].foto.toString();
          res.json({
            code: 200,
            data: rows[0],
            message: "Se devuelve la información del usuario",
          });
        } else if (rows == 0) {
          res.json({
            code: 404,
            data: {},
            message: "No existe un usuario con ese correo. Respuesta vacía",
          });
        }
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error",
        });
      }
    }
  );
});

// Permite modificar la información de perfil de un usuario

// Permite modificar la información de perfil de un usuario

router.post("/usuario/modificarUsuario", (req, res) => {
  const { documento, nombre, direccion, correo, nacionalidad, foto } = req.body;
  const query = `CALL edit_user(?, ?, ?, ?, ?, ?);`;
  mysqlConnect.query(
    query,
    [documento, nombre, direccion, correo, nacionalidad, foto],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          code: 204,
          data: {},
          message: "El usuario fue modificado con éxito",
        });
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error"
        })
      }
    }
  );
});

// Permite generar una nueva cuenta de usuario a partir del correo electrónico y la clave personal introducida por el usuario.

router.post("/usuario/nuevoUsuario", (req, res) => {
  const { correo, contrasenia } = req.body;
  const query = `CALL password_to_user(?, ?);`;
  mysqlConnect.query(query, [correo, contrasenia], (err, rows, fields) => {
    if (!err) {
      res.json({
        code: 201,
        data: {},
        message: "Se pudo registrar al usuario",
      });
    } else {
      if (err) {
        console.log(err);
        res.json({
          code: 409,
          data: {},
          message: "Error, no se pudo registrar al usuario",
        });
      }
    }
  });
});

// Login del usuario en el sistema.

router.post("/usuario/logIn", (req, res) => {
  const { correo, contrasenia } = req.body;
  if (correo && contrasenia) {
    mysqlConnect.query(
      "SELECT * FROM personas WHERE correo = ? AND contrasenia = ?",
      [correo, contrasenia],
      (err, rows, fields) => {
        if (rows[0] !== undefined) {
          res.json({
            code: 200,
            data: rows[0],
            message: "Login OK, devuelve la información del usuario",
          });
        } else {
          res.json({
            code: 401,
            data: {},
            message: "Credenciales incorrectas",
          });
        }
      }
    );
  } else {
    res.json({
      Status: "Ingresar datos",
    });
  }
});

// Generar código para usuario, mediante el correo

router.post("/usuario/generarCodigo", (req, res) => {
  const { correo } = req.body;
  const codigo = randomstring.generate(10);
  const query = `CALL code_to_user(?, ?);`;
  mysqlConnect.query(query, [correo, codigo], (err, rows, fields) => {
    if (!err) {
      res.json({
        code: 200,
        data: {},
        message: "El código se generó correctamente",
      });
    } else {
      console.log(err);
      res.json({
        code: 500,
        data: {},
        message: "Error en la creación del código",
      });
    }
  });
});

// Permite validar que un correo electrónico tiene código de registro existente.

router.post("/usuario/validarCorreoCodigo", (req, res) => {
  const { correo } = req.body;
  mysqlConnect.query(
    "SELECT * FROM personas WHERE correo = ? AND codigo IS NOT NULL;",
    [correo],
    (err, rows, fields) => {
      if (!err) {
        if (rows[0] !== undefined) {
          res.json({
            code: 204,
            data: {},
            message: "El correo ya tiene un código asignado",
          });
        } else {
          res.json({
            code: 409,
            data: {},
            message: "El correo no tiene un código asignado",
          });
        }
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error",
        });
      }
    }
  );
});

// Permite validar el código introducido con el usuario el cual lo habilita a generar su clave personal.

router.post("/usuario/validarCodigo", (req, res) => {
  const { correo, codigo } = req.body;
  if (correo && codigo) {
    mysqlConnect.query(
      "SELECT * FROM personas WHERE correo = ? AND codigo = ?;",
      [correo, codigo],
      (err, rows, fields) => {
        if (!err) {
          if (rows[0] !== undefined) {
            res.json({
              code: 204,
              data: {},
              message: "El código ingresado es correcto",
            });
          } else {
            res.json({
              code: 401,
              data: {},
              message: "El código ingresado es incorrecto",
            });
          }
        } else {
          console.log(err);
          res.json({
            code: 500,
            data: {},
            message: "Error",
          });
        }
      }
    );
  } else {
    res.json({ Status: "Ingresar datos" });
  }
});

//Devuelve la lista de subastas

//el identificador de subastadores no es autoincrement, coincide con el identificador de la tabla personas. Ej: el subastador Juan se registra en la tabla persona y tiene un identificador, ese mismo identificador es el que le corresponde en el campo 'identificador' de la tabla subastadores
//agregar columna 'titulo' a la tabla subastas
router.post("/subastas/getSubastas", (req, res) => {
  var data = [];
  mysqlConnect.query(
    "SELECT subastas.identificador, subastas.titulo, subastas.fecha, subastas.hora, personas.nombre, subastas.categoria, subastas.estado FROM subastas INNER JOIN personas ON subastas.subastador = personas.identificador;",
    (err, rows, fields) => {
      for (var element in rows) {
        //para cada fila de la tabla crea un objeto elemento 'subasta'
        var subasta = {
          idSubasta: rows[element]["identificador"],
          titulo: rows[element]["titulo"],
          fecha: rows[element]["fecha"],
          hora: rows[element]["hora"],
          rematador: rows[element]["nombre"],
          categoria: rows[element]["categoria"],
          estado: rows[element]["estado"],
        };

        console.log(subasta);
        data.push(subasta);
      }
      data = JSON.stringify(data);
      console.log(data.length);
      if (!err) {
        if (data.length != 0 && data[1] != "]") {
          res.json({
            code: 200,
            data: data,
            message: "Lista de subastas",
          });
        } else if (data[0] == "[") {
          res.json({
            code: 204,
            data: {},
            message: "No hay subastas cargadas",
          });
        }
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error",
        });
      }
    }
  );
});

//  Permite recuperar la lista de productos pertenecientes al catálogo de una subasta en particular
//  nombre, moneda, fotoCatalogo, estado

router.post("/subastas/getCatalogo", (req, res) => {
  var data = [];
  const { idSubasta } = req.body;
  mysqlConnect.query(
    "SELECT itemscatalogo.producto, catalogos.subasta, itemscatalogo.nombre, itemscatalogo.precioBase, itemscatalogo.moneda, itemscatalogo.fotoCatalogo, itemscatalogo.estado FROM itemscatalogo INNER JOIN catalogos ON catalogos.identificador = itemscatalogo.catalogo WHERE catalogos.subasta = ?;",
    idSubasta,
    (err, rows, fields) => {
      for (var element in rows) {
        const itemscatalogo = {
          idProducto: rows[element]["producto"],
          idSubasta: rows[element]["subasta"],
          nombre: rows[element]["nombre"],
          precioBase: rows[element]["precioBase"],
          moneda: rows[element]["moneda"],
          fotoCatalogo: (rows[element]["fotoCatalogo"]).toString(),
          estado: rows[element]["estado"],
        };
        console.log(itemscatalogo);
        data.push(itemscatalogo);
      }
      data = JSON.stringify(data);
      if (!err) {
        if (data.length != 0 && data[1] != "]") {
          res.json({
            code: 200,
            data: data,
            message:
              "Devuelve la lista de objetos pertenecientes al catálogo de la subasta",
          });
        } else if (data[0] == "[") {
          res.json({
            code: 204,
            data: {},
            message: "No hay items en el catalogo para esa subasta",
          });
        }
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error",
        });
      }
    }
  );
});

// // Permite recuperar la información de un producto perteneciente a un catálogo.

// router.post("/subastas/getProducto", (req, res) => {
//   var data = [];
//   const { idProducto, idSubasta } = req.body;
//   var queries = [
//     "SELECT productos.identificador, itemscatalogo.precioBase, itemscatalogo.nombre, subastas.categoria, subastaProducto.ultimaOferta, subastaProducto.dateTimeUltimaOferta, subastaProducto.documentoUltimaOferta, subastaProducto.precioVenta, productos.tipo, productos.duenio, personas.documento, productos.descripcionCompleta, productos.artista, productos.fechaArte, productos.historia, subastaProducto.estado FROM subastaProducto INNER JOIN productos ON (subastaProducto.producto = productos.identificador) INNER JOIN itemsCatalogo ON (productos.identificador = itemscatalogo.producto) INNER JOIN catalogos ON (itemscatalogo.catalogo = catalogos.identificador) INNER JOIN subastas ON (subastas.identificador = catalogos.subasta) INNER JOIN duenios ON (productos.duenio = duenios.identificador) INNER JOIN personas ON (personas.identificador = duenios.identificador) WHERE productos.identificador = ?",
//     "SELECT fotos.foto FROM fotos WHERE fotos.producto = ?",
//   ];
//   mysqlConnect.query(
//     queries.join(";"),
//     [idProducto, idProducto],
//     (err, rows, fields) => {
//       for (var element in rows) {
//         const productos = {
//           idProducto: rows[element]["identificador"],
//           idSubasta: idSubasta,
//           nombre: rows[element]["nombre"],
//           precioBase: rows[element]["precioBase"],
//           ultimaOferta: rows[element]["ultimaOferta"],
//           dateTimeUltimaOferta: rows[element]["dateTimeUltimaOferta"],
//           documentoUltimaOferta: rows[element]["documentoUltimaOferta"],
//           precioVenta: rows[element]["precioVenta"],
//           tipo: rows[element]["tipo"],
//           duenioActual: rows[element]["duenio"],
//           documentoDuenioActual: rows[element]["documento"],
//           descripcion: rows[element]["descripcionCompleta"],
//           numeroItem: rows[element]["identificador"],
//           arte: {
//             artista: rows[element]["artista"],
//             fechaArte: rows[element]["fechaArte"],
//             historia: rows[element]["historia"],
//           },
//           fotos: { foto: (rows[element]["foto"]).toString() },
//           categoria: rows[element]["categoria"],
//           estado: rows[element]["estado"],
//         };
//         console.log(productos);
//         data.push(productos);
//       }
//       data = JSON.stringify(data);
//       if (!err) {
//         if (data.length != 0 && data[1] != "]") {
//           res.json({
//             code: 200,
//             data: data,
//             message: "Devuelve toda la información del producto consultado",
//           });
//         } else if (data[0] == "[") {
//           res.json({
//             code: 204,
//             data: {},
//             message: "Sin contenido",
//           });
//         }
//       } else {
//         console.log(err);
//         res.json({
//           code: 500,
//           data: {},
//           message: "Error",
//         });
//       }
//     }
//   );
// });

// Permite recuperar la información de un producto perteneciente a un catálogo.

router.post("/subastas/getProducto", (req, res) => {
  var data = [];
  const { idProducto } = req.body;
  mysqlConnect.query(
    "SELECT subastaproducto.documentoUltimaOferta, subastaproducto.datetimeInicio,subastaproducto.dateTimeUltimaOferta, subastaproducto.estado, itemscatalogo.precioBase, subastaproducto.ultimaOferta FROM subastaproducto INNER JOIN itemscatalogo ON (itemscatalogo.producto=subastaproducto.producto) WHERE subastaproducto.producto=?",
    [idProducto],
    (err, rows, fields) => {
      if (!err) {
        var actualDatetime = new Date();
        var datetimeInicio = new Date (rows[0].datetimeInicio);
        console.log(rows[0].dateTimeUltimaOferta)
        if(rows[0].dateTimeUltimaOferta!=null){
          var finishDatetime = new Date (rows[0].dateTimeUltimaOferta);
          var auxMinutes=finishDatetime.getMinutes();
          finishDatetime.setMinutes(auxMinutes+10);
        }
        else{
          var finishDatetime = new Date (rows[0].datetimeInicio);
          var auxMinutes=finishDatetime.getMinutes();
          finishDatetime.setMinutes(auxMinutes+10);
        }
        
        console.log(finishDatetime)
        console.log(actualDatetime)
        if(actualDatetime>datetimeInicio && actualDatetime<finishDatetime && rows[0].estado=="espera"){ //setear inicio de subastaproducto
          mysqlConnect.query(
            "UPDATE subastaproducto SET estado='iniciada', dateTimeUltimaOferta=?, ultimaOferta=? WHERE subastaproducto.producto=?",
            [datetimeInicio,rows[0].precioBase,idProducto],
            (err, rows, fields) => {
              if (!err) {
                mysqlConnect.query(
                  "SELECT subastaproducto.datetimeInicio, productos.identificador as idProducto,subastas.identificador as idSubasta,itemscatalogo.nombre,itemscatalogo.moneda,itemscatalogo.precioBase, subastaproducto.ultimaOferta, subastaproducto.dateTimeUltimaOferta, subastaproducto.documentoUltimaOferta, subastaproducto.precioVenta, productos.tipo, personas.nombre as duenioActual, personas.documento, productos.descripcionCompleta, productos.artista,productos.fechaArte,productos.historia,subastas.categoria,subastaproducto.estado FROM productos INNER JOIN subastaproducto ON (productos.identificador=subastaproducto.producto) INNER JOIN itemscatalogo ON (productos.identificador=itemscatalogo.producto) INNER JOIN catalogos ON (itemscatalogo.catalogo=catalogos.identificador) INNER JOIN subastas ON (catalogos.subasta=subastas.identificador) INNER JOIN personas ON (productos.duenio=personas.identificador) WHERE productos.identificador= ?",
                  [idProducto],
                  (err, rows, fields) => {
                    const producto = {
                      idProducto: rows[0]["idProducto"],
                      idSubasta: rows[0]["idSubasta"],
                      nombre: rows[0]["nombre"],
                      precioBase: rows[0]["precioBase"],
                      ultimaOferta: rows[0]["ultimaOferta"],
                      dateTimeUltimaOferta: rows[0]["dateTimeUltimaOferta"],
                      documentoUltimaOferta: rows[0]["documentoUltimaOferta"],
                      precioVenta: rows[0]["precioVenta"],
                      tipo: rows[0]["tipo"],
                      duenioActual: rows[0]["duenioActual"],
                      documentoDuenioActual: rows[0]["documento"],
                      descripcion: rows[0]["descripcionCompleta"],
                      numeroItem: rows[0]["idProducto"],
                      moneda: rows[0]["moneda"],
                      arte: {
                        artista: rows[0]["artista"],
                        fechaArte: rows[0]["fechaArte"],
                        historia: rows[0]["historia"],
                      },
                      fotos: [],
                      categoria: rows[0]["categoria"],
                      estado: rows[0]["estado"],
                      datetimeInicio: rows[0]["datetimeInicio"]
                    };
                    //data = JSON.stringify(producto);
                    if (!err) {
                      mysqlConnect.query(
                        "SELECT fotos.foto FROM fotos WHERE producto=?;",
                        [idProducto],
                        (err, rows, fields) => {
                          if (!err) {
                            var fotos=[];
                            for(var element in rows){
                              console.log(rows[element].foto.toString());
                              var foto={
                                foto:rows[element].foto.toString()
                              }
                              fotos.push(foto);
                            }
                            console.log(fotos)
                            producto.fotos=fotos;
                            console.log(producto)
                            data = JSON.stringify(producto);
                            res.json({
                              code: 200,
                              data: data,
                              message: "Devuelve toda la información del producto consultado",
                            });
                          }
                          else {
                            console.log(err);
                            res.json({
                              code: 500,
                              data: {},
                              message: "Error",
                            });
                          }
                        });
                      
                    } else {
                      console.log(err);
                      res.json({
                        code: 500,
                        data: {},
                        message: "Error",
                      });
                    }
                  }
                );
              }
              else{
                res.json({
                  code: 500,
                  data: {},
                  message: "Error",
                });
              }
            })
        }
        else if(actualDatetime>finishDatetime && rows[0].estado=="iniciada" && rows[0]["documentoUltimaOferta"]!=null){
          console.log(rows[0]["documentoUltimaOferta"])
          mysqlConnect.query(
            "UPDATE subastaproducto SET estado = 'finalizada', precioVenta = ? WHERE producto = ?;",
            [rows[0]["ultimaOferta"],idProducto], ()=>{
              if (!err) {
                mysqlConnect.query(
                  "SELECT subastaproducto.datetimeInicio, productos.identificador as idProducto,subastas.identificador as idSubasta,itemscatalogo.nombre,itemscatalogo.moneda,itemscatalogo.precioBase, subastaproducto.ultimaOferta, subastaproducto.dateTimeUltimaOferta, subastaproducto.documentoUltimaOferta, subastaproducto.precioVenta, productos.tipo, personas.nombre as duenioActual, personas.documento, productos.descripcionCompleta, productos.artista,productos.fechaArte,productos.historia,subastas.categoria,subastaproducto.estado FROM productos INNER JOIN subastaproducto ON (productos.identificador=subastaproducto.producto) INNER JOIN itemscatalogo ON (productos.identificador=itemscatalogo.producto) INNER JOIN catalogos ON (itemscatalogo.catalogo=catalogos.identificador) INNER JOIN subastas ON (catalogos.subasta=subastas.identificador) INNER JOIN personas ON (productos.duenio=personas.identificador) WHERE productos.identificador= ?",
                  [idProducto],
                  (err, rows, fields) => {
                    const producto = {
                      idProducto: rows[0]["idProducto"],
                      idSubasta: rows[0]["idSubasta"],
                      nombre: rows[0]["nombre"],
                      precioBase: rows[0]["precioBase"],
                      ultimaOferta: rows[0]["ultimaOferta"],
                      dateTimeUltimaOferta: rows[0]["dateTimeUltimaOferta"],
                      documentoUltimaOferta: rows[0]["documentoUltimaOferta"],
                      precioVenta: rows[0]["precioVenta"],
                      tipo: rows[0]["tipo"],
                      duenioActual: rows[0]["duenioActual"],
                      documentoDuenioActual: rows[0]["documento"],
                      descripcion: rows[0]["descripcionCompleta"],
                      numeroItem: rows[0]["idProducto"],
                      moneda: rows[0]["moneda"],
                      arte: {
                        artista: rows[0]["artista"],
                        fechaArte: rows[0]["fechaArte"],
                        historia: rows[0]["historia"],
                      },
                      fotos: [],
                      categoria: rows[0]["categoria"],
                      estado: rows[0]["estado"],
                      datetimeInicio: rows[0]["datetimeInicio"]
                    };
                    //data = JSON.stringify(producto);
                    if (!err) {
                      mysqlConnect.query(
                        "SELECT fotos.foto FROM fotos WHERE producto=?;",
                        [idProducto],
                        (err, rows, fields) => {
                          if (!err) {
                            var fotos=[];
                            for(var element in rows){
                              //console.log(rows[element].foto.toString());
                              var foto={
                                foto:rows[element].foto.toString()
                              }
                              fotos.push(foto);
                            }
                            //console.log(fotos)
                            producto.fotos=fotos;
                            //console.log(producto)
                            data = JSON.stringify(producto);
                            res.json({
                              code: 200,
                              data: data,
                              message: "Devuelve toda la información del producto consultado",
                            });
                          }
                          else {
                            console.log(err);
                            res.json({
                              code: 500,
                              data: {},
                              message: "Error",
                            });
                          }
                        });
                      
                    } else {
                      console.log(err);
                      res.json({
                        code: 500,
                        data: {},
                        message: "Error",
                      });
                    }
                  }
                );
              }
              else{
                res.json({
                  code: 500,
                  data: {},
                  message: "Error",
                });
              }
            
            })
        }
        else if(actualDatetime>finishDatetime && rows[0].estado=="iniciada" && rows[0]["documentoUltimaOferta"]==null){
          console.log(rows[0]["documentoUltimaOferta"])
          mysqlConnect.query(
            "UPDATE subastaproducto SET estado = 'finalizada' WHERE producto = ?;",
            [idProducto], ()=>{
              if (!err) {
                mysqlConnect.query(
                  "SELECT subastaproducto.datetimeInicio, productos.identificador as idProducto,subastas.identificador as idSubasta,itemscatalogo.nombre,itemscatalogo.moneda,itemscatalogo.precioBase, subastaproducto.ultimaOferta, subastaproducto.dateTimeUltimaOferta, subastaproducto.documentoUltimaOferta, subastaproducto.precioVenta, productos.tipo, personas.nombre as duenioActual, personas.documento, productos.descripcionCompleta, productos.artista,productos.fechaArte,productos.historia,subastas.categoria,subastaproducto.estado FROM productos INNER JOIN subastaproducto ON (productos.identificador=subastaproducto.producto) INNER JOIN itemscatalogo ON (productos.identificador=itemscatalogo.producto) INNER JOIN catalogos ON (itemscatalogo.catalogo=catalogos.identificador) INNER JOIN subastas ON (catalogos.subasta=subastas.identificador) INNER JOIN personas ON (productos.duenio=personas.identificador) WHERE productos.identificador= ?",
                  [idProducto],
                  (err, rows, fields) => {
                    const producto = {
                      idProducto: rows[0]["idProducto"],
                      idSubasta: rows[0]["idSubasta"],
                      nombre: rows[0]["nombre"],
                      precioBase: rows[0]["precioBase"],
                      ultimaOferta: rows[0]["ultimaOferta"],
                      dateTimeUltimaOferta: rows[0]["dateTimeUltimaOferta"],
                      documentoUltimaOferta: rows[0]["documentoUltimaOferta"],
                      precioVenta: rows[0]["precioVenta"],
                      tipo: rows[0]["tipo"],
                      duenioActual: rows[0]["duenioActual"],
                      documentoDuenioActual: rows[0]["documento"],
                      descripcion: rows[0]["descripcionCompleta"],
                      numeroItem: rows[0]["idProducto"],
                      moneda: rows[0]["moneda"],
                      arte: {
                        artista: rows[0]["artista"],
                        fechaArte: rows[0]["fechaArte"],
                        historia: rows[0]["historia"],
                      },
                      fotos: [],
                      categoria: rows[0]["categoria"],
                      estado: rows[0]["estado"],
                      datetimeInicio: rows[0]["datetimeInicio"]
                    };
                    //data = JSON.stringify(producto);
                    if (!err) {
                      mysqlConnect.query(
                        "SELECT fotos.foto FROM fotos WHERE producto=?;",
                        [idProducto],
                        (err, rows, fields) => {
                          if (!err) {
                            var fotos=[];
                            for(var element in rows){
                              //console.log(rows[element].foto.toString());
                              var foto={
                                foto:rows[element].foto.toString()
                              }
                              fotos.push(foto);
                            }
                            //console.log(fotos)
                            producto.fotos=fotos;
                            //console.log(producto)
                            data = JSON.stringify(producto);
                            res.json({
                              code: 200,
                              data: data,
                              message: "Devuelve toda la información del producto consultado",
                            });
                          }
                          else {
                            console.log(err);
                            res.json({
                              code: 500,
                              data: {},
                              message: "Error",
                            });
                          }
                        });
                      
                    } else {
                      console.log(err);
                      res.json({
                        code: 500,
                        data: {},
                        message: "Error",
                      });
                    }
                  }
                );
              }
              else{
                res.json({
                  code: 500,
                  data: {},
                  message: "Error",
                });
              }
            
            })
        }
        else if(actualDatetime>finishDatetime && rows[0].estado=="espera"){
          mysqlConnect.query(
            "UPDATE subastaProducto SET estado = 'finalizada' WHERE producto = ?;",
            [idProducto], ()=>{
              if (!err) {
                mysqlConnect.query(
                  "SELECT subastaproducto.datetimeInicio, productos.identificador as idProducto,subastas.identificador as idSubasta,itemscatalogo.nombre,itemscatalogo.moneda,itemscatalogo.precioBase, subastaproducto.ultimaOferta, subastaproducto.dateTimeUltimaOferta, subastaproducto.documentoUltimaOferta, subastaproducto.precioVenta, productos.tipo, personas.nombre as duenioActual, personas.documento, productos.descripcionCompleta, productos.artista,productos.fechaArte,productos.historia,subastas.categoria,subastaproducto.estado FROM productos INNER JOIN subastaproducto ON (productos.identificador=subastaproducto.producto) INNER JOIN itemscatalogo ON (productos.identificador=itemscatalogo.producto) INNER JOIN catalogos ON (itemscatalogo.catalogo=catalogos.identificador) INNER JOIN subastas ON (catalogos.subasta=subastas.identificador) INNER JOIN personas ON (productos.duenio=personas.identificador) WHERE productos.identificador= ?",
                  [idProducto],
                  (err, rows, fields) => {
                    const producto = {
                      idProducto: rows[0]["idProducto"],
                      idSubasta: rows[0]["idSubasta"],
                      nombre: rows[0]["nombre"],
                      precioBase: rows[0]["precioBase"],
                      ultimaOferta: rows[0]["ultimaOferta"],
                      dateTimeUltimaOferta: rows[0]["dateTimeUltimaOferta"],
                      documentoUltimaOferta: rows[0]["documentoUltimaOferta"],
                      precioVenta: rows[0]["precioVenta"],
                      tipo: rows[0]["tipo"],
                      duenioActual: rows[0]["duenioActual"],
                      documentoDuenioActual: rows[0]["documento"],
                      descripcion: rows[0]["descripcionCompleta"],
                      numeroItem: rows[0]["idProducto"],
                      moneda: rows[0]["moneda"],
                      arte: {
                        artista: rows[0]["artista"],
                        fechaArte: rows[0]["fechaArte"],
                        historia: rows[0]["historia"],
                      },
                      fotos: [],
                      categoria: rows[0]["categoria"],
                      estado: rows[0]["estado"],
                      datetimeInicio: rows[0]["datetimeInicio"]
                    };
                    //data = JSON.stringify(producto);
                    if (!err) {
                      mysqlConnect.query(
                        "SELECT fotos.foto FROM fotos WHERE producto=?;",
                        [idProducto],
                        (err, rows, fields) => {
                          if (!err) {
                            var fotos=[];
                            for(var element in rows){
                              console.log(rows[element].foto.toString());
                              var foto={
                                foto:rows[element].foto.toString()
                              }
                              fotos.push(foto);
                            }
                            console.log(fotos)
                            producto.fotos=fotos;
                            console.log(producto)
                            data = JSON.stringify(producto);
                            res.json({
                              code: 200,
                              data: data,
                              message: "Devuelve toda la información del producto consultado",
                            });
                          }
                          else {
                            console.log(err);
                            res.json({
                              code: 500,
                              data: {},
                              message: "Error",
                            });
                          }
                        });
                      
                    } else {
                      console.log(err);
                      res.json({
                        code: 500,
                        data: {},
                        message: "Error",
                      });
                    }
                  }
                );
              }
              else{
                res.json({
                  code: 500,
                  data: {},
                  message: "Error",
                });
              }
            
            })
        }
        else{
          console.log(rows[0]["documentoUltimaOferta"])
          mysqlConnect.query(
            "SELECT subastaproducto.datetimeInicio, productos.identificador as idProducto,subastas.identificador as idSubasta,itemscatalogo.nombre,itemscatalogo.moneda,itemscatalogo.precioBase, subastaproducto.ultimaOferta, subastaproducto.dateTimeUltimaOferta, subastaproducto.documentoUltimaOferta, subastaproducto.precioVenta, productos.tipo, personas.nombre as duenioActual, personas.documento, productos.descripcionCompleta, productos.artista,productos.fechaArte,productos.historia,subastas.categoria,subastaproducto.estado FROM productos INNER JOIN subastaproducto ON (productos.identificador=subastaproducto.producto) INNER JOIN itemscatalogo ON (productos.identificador=itemscatalogo.producto) INNER JOIN catalogos ON (itemscatalogo.catalogo=catalogos.identificador) INNER JOIN subastas ON (catalogos.subasta=subastas.identificador) INNER JOIN personas ON (productos.duenio=personas.identificador) WHERE productos.identificador= ?",
            [idProducto],
            (err, rows, fields) => {
              const producto = {
                idProducto: rows[0]["idProducto"],
                idSubasta: rows[0]["idSubasta"],
                nombre: rows[0]["nombre"],
                precioBase: rows[0]["precioBase"],
                ultimaOferta: rows[0]["ultimaOferta"],
                dateTimeUltimaOferta: rows[0]["dateTimeUltimaOferta"],
                documentoUltimaOferta: rows[0]["documentoUltimaOferta"],
                precioVenta: rows[0]["precioVenta"],
                tipo: rows[0]["tipo"],
                duenioActual: rows[0]["duenioActual"],
                documentoDuenioActual: rows[0]["documento"],
                descripcion: rows[0]["descripcionCompleta"],
                numeroItem: rows[0]["idProducto"],
                moneda: rows[0]["moneda"],
                arte: {
                  artista: rows[0]["artista"],
                  fechaArte: rows[0]["fechaArte"],
                  historia: rows[0]["historia"],
                },
                fotos: [],
                categoria: rows[0]["categoria"],
                estado: rows[0]["estado"],
                datetimeInicio: rows[0]["datetimeInicio"]
              };
              //data = JSON.stringify(producto);
              if (!err) {
                mysqlConnect.query(
                  "SELECT fotos.foto FROM fotos WHERE producto=?;",
                  [idProducto],
                  (err, rows, fields) => {
                    if (!err) {
                      var fotos=[];
                      for(var element in rows){
                        console.log(rows[element].foto.toString());
                        var foto={
                          foto:rows[element].foto.toString()
                        }
                        fotos.push(foto);
                      }
                      console.log(fotos)
                      producto.fotos=fotos;
                      console.log(producto)
                      data = JSON.stringify(producto);
                      res.json({
                        code: 200,
                        data: data,
                        message: "Devuelve toda la información del producto consultado",
                      });
                    }
                    else {
                      console.log(err);
                      res.json({
                        code: 500,
                        data: {},
                        message: "Error",
                      });
                    }
                  });
                
              } else {
                console.log(err);
                res.json({
                  code: 500,
                  data: {},
                  message: "Error",
                });
              }
            }
          );
        }
      }
      else{
        res.json({
          code: 500,
          data: {},
          message: "Error",
        });
      }
    })
  
});

// Permite recuperar los métodos de pago registrados por un usuario

router.post("/usuario/getMetodosPago", (req, res) => {
  var data = [];
  const { documento } = req.body;
  mysqlConnect.query(
    "SELECT metododepago.idMetodo, metododepago.nombreMetodo, personas.nombre, metododepago.numeroTarjeta, personas.documento, metododepago.codigoSeguridad, metododepago.vencimiento, metododepago.tipoTarjeta, metododepago.tarjeta, metododepago.banco, metododepago.tipoMetodo, metododepago.estado, metododepago.cbu, metododepago.alias, metododepago.numeroCuenta, metododepago.cuit FROM metododepago INNER JOIN personas ON metododepago.duenio = personas.identificador WHERE personas.documento = ?;",
    [documento],
    (err, rows, fields) => {
      for (var element in rows) {
        const metodos = {
          idMetodo: rows[element]["idMetodo"],
          nombreMetodo: rows[element]["nombreMetodo"],
          nombreTitular: rows[element]["nombre"],
          numeroTarjeta: rows[element]["numeroTarjeta"],
          documentoTitular: rows[element]["documento"],
          codigoSeguridad: rows[element]["codigoSeguridad"],
          vencimiento: rows[element]["vencimiento"],
          tipoTarjeta: rows[element]["tipoTarjeta"],
          tarjeta: rows[element]["tarjeta"],
          banco: rows[element]["banco"],
          tipoMetodo: rows[element]["tipoMetodo"],
          estado: rows[element]["estado"],
          cbu: rows[element]["cbu"],
          alias: rows[element]["alias"],
          numeroCuenta: rows[element]["numeroCuenta"],
          cuit: rows[element]["cuit"],
        };
        console.log(metodos);
        data.push(metodos);
      }
      data = JSON.stringify(data);
      console.log(`La longitud de la data es: ${data.length}`);
      if (!err) {
        if (data.length != 0 && data[1] != "]") {
          res.json({
            code: 200,
            data: data,
            message:
              "Devuelve una lista con la información de los diferentes métodos de pago registrados.",
          });
        } else if (data[0] == "[") {
          res.json({
            code: 204,
            data: {},
            message:
              "El usuario no tiene métodos de pago registrados. Respuesta vacía",
          });
        }
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: " Error interno en la recuperación de métodos de pago",
        });
      }
    }
  );
});

// Permite recuperar la subasta en la que está participando un usuario determinado.

router.post("/subastas/getSubastaActiva", (req, res) => {
  var data = [];
  const { documento, idSubasta } = req.body;
  console.log(req.body)
  mysqlConnect.query(
    "SELECT subastas.identificador, subastas.titulo, subastas.fecha, subastas.hora, subastas.subastador, subastas.categoria, subastaproducto.estado FROM subastaProducto INNER JOIN productos ON (subastaProducto.producto = productos.identificador) INNER JOIN itemscatalogo ON (itemscatalogo.producto = productos.identificador) INNER JOIN catalogos ON (catalogos.identificador = itemscatalogo.catalogo) INNER JOIN subastas ON (catalogos.subasta = subastas.identificador) WHERE subastaproducto.documentoUltimaOferta = ? AND subastas.identificador != ? AND subastaproducto.estado='iniciada' LIMIT 1;",
    [documento, idSubasta],
    (err, rows, fields) => {
      console.log(rows)
      if(rows.length != 0){
        const subastaActiva = {
          idSubasta: rows[0]["identificador"],
          titulo: rows[0]["titulo"],
          fecha: rows[0]["fecha"],
          hora: rows[0]["hora"],
          rematador: rows[0]["subastador"],
          categoria: rows[0]["categoria"],
          estado: rows[0]["estado"],
         };
        data.push(subastaActiva)        
      }
      
      // for (var element in rows) {
      //   const subastaActiva = {
      //     idSubasta: rows[element]["identificador"],
      //     titulo: rows[element]["titulo"],
      //     fecha: rows[element]["fecha"],
      //     hora: rows[element]["hora"],
      //     rematador: rows[element]["subastador"],
      //     categoria: rows[element]["categoria"],
      //     estado: rows[element]["estado"],
      //   };
        // console.log(subastaActiva);
        // data.push(subastaActiva);
      //}
      
      if (!err) {
        if (data.length != 0 ) {
          res.json({
            code: 200,
            data: JSON.stringify(data[0]),
            message: "Devuelve la información de la subasta activa del usuario",
          });
        } else{
          res.json({
            code: 204,
            data: {},
            message:
              "El usuario no está participando de ninguna subasta. Respuesta vacía",
          });
        }
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error interno en la recuperación de métodos de pago",
        });
      }
    }
  );
});



// Permite registrar una nueva oferta para un producto determinado
router.post("/subastas/nuevaOferta", (req, res) => {
  var { documento, idMetodoPago, idProducto, valorOferta } = req.body;
  var dateTimeNuevaOferta = new Date();
  mysqlConnect.query(
    "SELECT subastaproducto.estado, subastaproducto.ultimaOferta, subastaproducto.dateTimeUltimaOferta, subastaproducto.documentoUltimaOferta, subastaproducto.producto, itemscatalogo.precioBase, subastas.categoria, personas.documento, productos.duenio FROM subastaproducto INNER JOIN productos ON (subastaproducto.producto=productos.identificador) INNER JOIN itemscatalogo ON (subastaproducto.producto=itemscatalogo.producto) INNER JOIN catalogos ON (itemscatalogo.catalogo=catalogos.identificador) INNER JOIN subastas ON (subastas.identificador=catalogos.identificador) INNER JOIN personas ON (personas.identificador=productos.duenio) WHERE subastaproducto.producto= ?;",
    [idProducto],
    (err, rows, fields) => {
      if (!err) {
        console.log(rows[0].categoria);
        if(valorOferta>=0.01*rows[0].precioBase+rows[0].ultimaOferta){//chequea precio minimo //chequea precio maximo //chequea ultimo ofertante, no puede ser el mismo //el duenio no puede ser el mismo que el ofertante
          if((rows[0].categoria!="platino" && rows[0].categoria!="oro" && valorOferta>1.2*rows[0].ultimaOferta) || rows[0].documentoUltimaOferta==documento || documento == rows[0].documento || rows[0].estado!="iniciada"){
            res.json({
              code: 500,
              data: {},
              message: "Error interno en el registro de la nueva oferta",
            });
          }
          else{
            var dateTimeUltimaOferta=new Date(rows[0].dateTimeUltimaOferta);
            console.log(dateTimeUltimaOferta)
            console.log(dateTimeNuevaOferta)
            var auxMinutes=dateTimeUltimaOferta.getMinutes();
            dateTimeUltimaOferta.setMinutes(auxMinutes+10);
            if(dateTimeNuevaOferta>dateTimeUltimaOferta){//chequea fecha
              console.log("se paso del tiempo")
              console.log(dateTimeUltimaOferta)
              //debe actualizar el estado a finalizada
              mysqlConnect.query(
                "UPDATE subastaProducto SET estado = 'finalizada', precioVenta=? WHERE producto = ?;",
                [rows[0].ultimaOferta,idProducto], ()=>{})
              res.json({
                code: 500,
                data: {},
                message: "Error interno en el registro de la nueva oferta",
              });
              return;
            }
            else{//si la fecha esta OK, actualizar los valores de ultima oferta
            
              mysqlConnect.query(
                "UPDATE subastaproducto SET ultimaOferta = ?, dateTimeUltimaOferta = ?, documentoUltimaOferta = ?, metodoDePago = ? WHERE producto = ?;",
                [valorOferta, dateTimeNuevaOferta, documento, idMetodoPago, idProducto],
                (err, rows, fields) => {
                  if (!err) {
                    res.json({
                      code: 201,
                      data: {},
                      message: "La oferta se registró con éxito",
                    });
                  } else {
                    console.log(err);
                    res.json({
                      code: 500,
                      data: {},
                      message: "Error interno en el registro de la nueva oferta",
                    });
                  }
                }
              );
            }
          }
          
        }       
        else{
          res.json({
            code: 500,
            data: {},
            message: "Error interno en el registro de la nueva oferta",
          });
        }
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message: "Error interno en el registro de la nueva oferta",
        });
      }
    }
  );
});

// Permite recuperar la información de la última oferta de un producto en subasta.

router.post("/subastas/getUltimaOferta", (req, res) => {
  var data = [];
  const { idSubasta, idProducto } = req.body;
  mysqlConnect.query(
    "SELECT subastaProducto.ultimaOferta, subastaProducto.documentoUltimaOferta, subastaProducto.dateTimeUltimaOferta, subastaProducto.precioVenta, subastaProducto.estado, subastaProducto.producto, subastas.categoria FROM subastaProducto INNER JOIN subastas ON (subastas.identificador = ?) WHERE subastaProducto.producto = ?;",
    [idSubasta, idProducto],
    (err, rows, fields) => {
      for (var element in rows) {
        const ultimaOferta = {
          idProducto: rows[element]["producto"],
          idSubasta: idSubasta,
          ultimaOferta: rows[element]["ultimaOferta"],
          documentoUltimaOferta: rows[element]["documentoUltimaOferta"],
          dateTimeUltimaOferta: rows[element]["dateTimeUltimaOferta"],
          precioVenta: rows[element]["precioVenta"],
          categoria: rows[element]["categoria"],
          estado: rows[element]["estado"],
        };
        console.log(ultimaOferta);
        data.push(ultimaOferta);
      }
      data = JSON.stringify(data);
      if (!err) {
        if (data.length != 0 && data[1] != "]") {
          res.json({
            code: 200,
            data: data,
            message:
              "Devuelve la información de la última oferta de un producto",
          });
        } else if (data[0] == "[") {
          res.json({
            code: 204,
            data: {},
            message: "El producto no tiene una oferta aún",
          });
        }
      } else {
        console.log(err);
        res.json({
          code: 500,
          data: {},
          message:
            "Error interno en la obtención de la última oferta del producto",
        });
      }
    }
  );
});

module.exports = router;
