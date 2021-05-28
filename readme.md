# Aplicaciones Distribuidas - REST API - BACKEND

Repositorio para la REST API de la materia Aplicaciones Distribuidas. Desarrollado con Node.js - Express consumiendo una base de datos relacional MySQL.

## Despliegue

Para poder levantar el proyecto:

### Clonar repositorio

- Clonar este repositorio a tu maquina local, abriendo una consola y ejecutando:
  `git clone https://github.com/knarfff/API-REST-ADistribuidas.git`

### Configuración

- En el destino donde se clono el repositorio, abrir una consola con permisos de administrador y ejecutar el siguiente comando:

```bash
npm install
```

- Modificar el archivo database.js con la contraseña correspondiente y el nombre de la base de datos a utilizar.


- Luego una vez instaladas las dependencias de node, ejecutar el siguiente comando:

```bash
npm run dev
```

La aplicación se ejecutará en el puerto 3001.