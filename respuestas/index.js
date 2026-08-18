const fs = require("fs");
const path = require("path");

const modulos = fs
    .readdirSync(__dirname)
    .filter(
        archivo =>
            archivo.endsWith(".js") &&
            archivo !== "index.js" &&
            archivo !== "enviofotos.js"
    )
    .sort((a, b) => {

        if (a === "complejodemagencio.js") return -1;
        if (b === "complejodemagencio.js") return 1;

        return a.localeCompare(b);

    })
    .map(archivo =>
        require(path.join(__dirname, archivo))
    );

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

            console.error(
                "❌ Error en módulo:",
                error
            );

        }

    }

    return null;

};