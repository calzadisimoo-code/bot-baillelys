const fs = require("fs");
const path = require("path");

const archivo = path.join(__dirname, "estado.json");

function cargar() {

    if (!fs.existsSync(archivo)) {
        fs.writeFileSync(archivo, "{}");
    }

    return JSON.parse(
        fs.readFileSync(
            archivo,
            "utf8"
        )
    );

}

function guardar(usuario, datos) {

    const estados = cargar();

    const actual =
        estados[usuario] || {};

    estados[usuario] = {
        ...actual,
        ...datos
    };

    fs.writeFileSync(
        archivo,
        JSON.stringify(
            estados,
            null,
            4
        )
    );

}

function obtener(usuario) {

    const estados = cargar();

    return estados[usuario];

}

function borrar(usuario) {

    const estados = cargar();

    delete estados[usuario];

    fs.writeFileSync(
        archivo,
        JSON.stringify(
            estados,
            null,
            4
        )
    );

}

function actualizarActividad(usuario) {

    guardar(usuario, {
        ultimaActividad: Date.now()
    });

}

module.exports = {
    guardar,
    obtener,
    borrar,
    actualizarActividad
};