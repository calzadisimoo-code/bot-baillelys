const fs = require("fs");
const path = require("path");

const archivos = fs
    .readdirSync(__dirname)
    .sort()
    .filter(
        a =>
            a.endsWith(".js") &&
            a !== "index.js"
    );

const respuestas = archivos.map(a =>
    require(path.join(__dirname, a))
);

module.exports = function (texto, usuario) {

    if (typeof texto !== "string") {
        return null;
    }

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .trim();

    for (const respuesta of respuestas) {

        const r = respuesta(texto, usuario);

        if (r) return r;

    }

    return null;

};