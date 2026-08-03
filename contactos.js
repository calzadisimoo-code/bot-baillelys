const fs = require("fs");
const path = require("path");

const archivo = path.join(
    __dirname,
    "contactos.json"
);

if (!fs.existsSync(archivo)) {

    fs.writeFileSync(
        archivo,
        JSON.stringify({}, null, 4)
    );

}

function cargar() {

    return JSON.parse(
        fs.readFileSync(
            archivo,
            "utf8"
        )
    );

}

function guardarContacto(
    jid,
    nombre
) {

    const datos = cargar();

    datos[jid] = {

        nombre,
        ultimaActividad:
            Date.now()

    };

    fs.writeFileSync(

        archivo,

        JSON.stringify(
            datos,
            null,
            4
        )

    );

}

function obtenerContactos() {

    return Object.keys(
        cargar()
    );

}

module.exports = {

    guardarContacto,
    obtenerContactos

};