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
  const query = `CALL add_postulante(?, ?, ?, ?, ?, ?);`;
  mysqlConnect.query(
    query,
    [documento, nombre, direccion, myblob, correo, nacionalidad],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          code: 201,
          data: {},
          message: "Se registra correctamente al usuario.",
        });
      } else {
        console.log(err);
        res.json({
          code: 409,
          data: {},
          message: "Error en la creacion del usuario",
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
  mysqlConnect.query(
    "SELECT * FROM personas WHERE documento = ?;",
    [documento],
    (err, rows, fields) => {
      if (!err) {
        if (rows[0] !== undefined) {
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
        if (rows[0] !== undefined) {
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

router.post("/usuario/modificarUsuario", (req, res) => {
  const { documento, nombre, direccion, correo, nacionalidad, foto } = req.body;
  const query = `CALL edit_user(?, ?, ?, ?, ?, ?);`;
  mysqlConnect.query(
    "SELECT * FROM personas WHERE correo = ?;",
    [correo],
    (err, rows, fields) => {
      if (!err) {
        if (rows == 0) {
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
              }
            }
          );
        } else {
          res.json({
            code: 409,
            data: {},
            message: "El correo electrónico ya está registrado",
          });
        }
      } else {
        console.log(err);
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

  var data=[]
  mysqlConnect.query(
    "SELECT subastas.identificador, subastas.titulo, subastas.fecha, subastas.hora, personas.nombre, subastas.categoria, subastas.estado FROM subastas INNER JOIN personas ON subastas.subastador = personas.identificador;",
    (err, rows, fields) => {      
      for (var element in rows){ //para cada fila de la tabla crea un objeto elemento 'subasta'
        var subasta={
          idSubasta:rows[element]['identificador'],
          titulo: rows[element]['titulo'],
          fecha: rows[element]['fecha'],
          hora: rows[element]['hora'],
          rematador:rows[element]['nombre'],
          categoria:rows[element]['categoria'],
          estado:rows[element]['estado']
        }
        
        console.log(subasta)
        data.push(subasta)
      }
      data=JSON.stringify(data)
      if (!err) {
        if (data.length!=0) {
          res.json({
            code: 200,
            data: data,
            message: "Lista de subastas",
          });
        } else {
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


module.exports = router;
