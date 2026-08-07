const fs = require("fs");
const path = require("path");

const carpeta = path.join(__dirname, "modulos");

const modulos = fs
    .readdirSync(carpeta)
    .filter(a => a.endsWith(".js"))
    .map(a => require(path.join(carpeta, a)));

console.log("📦 Módulos cargados:", modulos.length);

module.exports = function (texto, usuario) {

    if (typeof texto !== "string") {
        return null;
    }

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    for (const modulo of modulos) {

        try {

            const respuesta = modulo(texto, usuario);

            if (respuesta) {
                return respuesta;
            }

        } catch (error) {

            console.error("❌ Error en módulo:", error);
        }

    }

    return null;

};